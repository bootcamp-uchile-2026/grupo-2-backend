import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource, EntityManager, In, SelectQueryBuilder } from 'typeorm';
import { CustomersService } from '../customers/customers.service';
import { CustomerEntity } from '../models/customer.entity';
import { OrderEntity, OrderStatus } from '../models/order.entity';
import { OrderItemEntity } from '../models/order-item.entity';
import { ReturnEntity, ReturnStatus } from '../models/return.entity';
import { ReturnItemEntity } from '../models/return-item.entity';
import { CreateReturnDto } from '../dto/create-return.dto';
import { ReturnQueryDto } from '../dto/return-query.dto';
import { ReturnResponseDto } from '../dto/return-response.dto';
import { CustomerNotFoundError } from '../common/errors/customer-not-found.error';
import { OrderNotFoundError } from '../common/errors/order-not-found.error';
import { OrderItemNotFoundError } from '../common/errors/order-item-not-found.error';
import { ReturnNotFoundError } from '../common/errors/return-not-found.error';
import { InvalidReturnError } from '../common/errors/invalid-return.error';

import { ReturnMapper } from './return.mapper';
import { UpdateReturnStatusDto } from 'src/dto/update-return-status.dto';
import { InvalidReturnStatusError } from 'src/common/errors/invalid-return-status.error';

@Injectable()
export class ReturnsService {

    constructor(
        private readonly customersService: CustomersService,
        private readonly dataSource: DataSource) { }

    async create(customerId: number, dto: CreateReturnDto, userId: number): Promise<ReturnResponseDto> {
        const reason = dto.reason.trim();

        if (!reason) {
            throw new BadRequestException(
                'El motivo de la devolución es obligatorio.',
            );
        }

        const orderItemIds = dto.items.map(
            item => item.orderItemId,
        );

        if (new Set(orderItemIds).size !== orderItemIds.length) {
            throw new BadRequestException(
                'No se pueden repetir ítems en una solicitud de devolución.',
            );
        }

        return this.dataSource.transaction(async manager => {

            await this.customersService.validateOwnership(
                customerId,
                userId,
                true,
                manager,
            );

            await this.lockCustomer(customerId, manager);

            await this.customersService.validateOwnership(
                customerId,
                userId,
                true,
                manager,
            );

            const order = await manager.findOne(OrderEntity, {
                where: {
                    id: dto.orderId,
                    customerId,
                },
                lock: {
                    mode: 'pessimistic_write',
                },
            });

            if (!order) {
                throw new OrderNotFoundError();
            }

            if (order.status !== OrderStatus.DELIVERED) {
                throw new InvalidReturnError(
                    'Solo se pueden solicitar devoluciones de pedidos entregados.',
                );
            }

            const orderItems = await manager.find(
                OrderItemEntity,
                {
                    where: {
                        orderId: order.id,
                    },
                },
            );

            const returnedQuantities =
                await this.findReturnedQuantities(
                    orderItemIds,
                    manager,
                );

            for (const item of dto.items) {

                const orderItem = orderItems.find(
                    orderItem => orderItem.id === item.orderItemId,
                );

                if (!orderItem) {
                    throw new OrderItemNotFoundError();
                }

                const previousQuantity =
                    returnedQuantities.get(orderItem.id) ?? 0;

                const availableQuantity =
                    orderItem.quantity - previousQuantity;

                if (item.quantity > availableQuantity) {
                    throw new InvalidReturnError(
                        `La cantidad solicitada para ${orderItem.productName} supera las unidades disponibles para devolución.`,
                    );
                }
            }

            const now = new Date();

            const returnRequest = await manager.save(
                ReturnEntity,
                {
                    orderId: order.id,
                    status: ReturnStatus.REQUESTED,
                    reason,
                    adminNotes: null,
                    processedBy: null,
                    createdAt: now,
                    updatedAt: now,
                    completedAt: null,
                },
            );

            const returnItems: ReturnItemEntity[] = [];

            for (const item of dto.items) {

                const orderItem = orderItems.find(
                    orderItem => orderItem.id === item.orderItemId,
                )!;

                const returnItem = await manager.save(
                    ReturnItemEntity,
                    {
                        returnId: returnRequest.id,
                        orderItemId: orderItem.id,
                        quantity: item.quantity,
                        refundAmount: 0,
                        greenPointsRestored: 0,
                        restock: false,
                    },
                );

                returnItem.orderItem = orderItem;

                returnItems.push(returnItem);
            }

            returnRequest.order = order;

            return ReturnMapper.toResponseDto(
                returnRequest,
                returnItems,
            );
        });
    }

    async findAllByCustomer(customerId: number, query: ReturnQueryDto, userId: number) {

        await this.customersService.validateOwnership(customerId, userId, true);

        const queryBuilder = this.dataSource.manager
            .createQueryBuilder(ReturnEntity, 'returnRequest')
            .innerJoinAndSelect(
                'returnRequest.order',
                'order',
            )
            .where('order.customerId = :customerId', {
                customerId,
            });

        return this.paginateReturns(queryBuilder, query);
    }

    async findOneByCustomer(customerId: number, returnId: number, userId: number): Promise<ReturnResponseDto> {

        await this.customersService.validateOwnership(customerId, userId, true);

        this.validateReturnId(returnId);

        const returnRequest = await this.dataSource.manager
            .createQueryBuilder(ReturnEntity, 'returnRequest')
            .innerJoinAndSelect(
                'returnRequest.order',
                'order',
            )
            .where('returnRequest.id = :returnId', {
                returnId,
            })
            .andWhere('order.customerId = :customerId', {
                customerId,
            })
            .getOne();

        if (!returnRequest) {
            throw new ReturnNotFoundError();
        }

        const returnItems = await this.findItemsByReturns([
            returnRequest.id,
        ]);

        return ReturnMapper.toResponseDto(
            returnRequest,
            returnItems,
        );
    }

    async findAllByAdmin(query: ReturnQueryDto) {

        const queryBuilder = this.dataSource.manager
            .createQueryBuilder(ReturnEntity, 'returnRequest')
            .innerJoinAndSelect(
                'returnRequest.order',
                'order',
            );

        return this.paginateReturns(queryBuilder, query);
    }

    async findOneByAdmin(returnId: number): Promise<ReturnResponseDto> {

        this.validateReturnId(returnId);

        const returnRequest = await this.dataSource.manager.findOne(
            ReturnEntity,
            {
                where: {
                    id: returnId,
                },
                relations: {
                    order: true,
                },
            },
        );

        if (!returnRequest) {
            throw new ReturnNotFoundError();
        }

        const returnItems = await this.findItemsByReturns([
            returnRequest.id,
        ]);

        return ReturnMapper.toResponseDto(
            returnRequest,
            returnItems,
        );
    }

    async updateStatus(returnId: number, dto: UpdateReturnStatusDto, userId: number): Promise<ReturnResponseDto> {

        this.validateReturnId(returnId);

        return this.dataSource.transaction(async manager => {

            const existingReturn = await manager.findOne(
                ReturnEntity,
                {
                    where: {
                        id: returnId,
                    },
                    relations: {
                        order: true,
                    },
                },
            );

            if (!existingReturn) {
                throw new ReturnNotFoundError();
            }

            await this.lockCustomer(
                existingReturn.order.customerId,
                manager,
            );

            const order = await manager.findOne(
                OrderEntity,
                {
                    where: {
                        id: existingReturn.orderId,
                    },
                    lock: {
                        mode: 'pessimistic_write',
                    },
                },
            );

            if (!order) {
                throw new OrderNotFoundError();
            }

            const returnRequest = await manager.findOne(
                ReturnEntity,
                {
                    where: {
                        id: returnId,
                    },
                    lock: {
                        mode: 'pessimistic_write',
                    },
                },
            );

            if (!returnRequest) {
                throw new ReturnNotFoundError();
            }

            returnRequest.order = order;

            if (order.status !== OrderStatus.DELIVERED) {
                throw new InvalidReturnError(
                    'El pedido debe estar entregado para gestionar su devolución.',
                );
            }

            const returnItems = await this.findItemsByReturns(
                [returnRequest.id],
                manager,
            );

            if (returnItems.length === 0) {
                throw new InvalidReturnError(
                    'La devolución no contiene productos.',
                );
            }

            if (
                dto.status !== ReturnStatus.COMPLETED &&
                dto.restockOrderItemIds !== undefined
            ) {
                throw new BadRequestException(
                    'La reposición de stock solo puede indicarse al completar una devolución.',
                );
            }

            switch (dto.status) {

                case ReturnStatus.APPROVED:

                    return this.approveReturn(
                        returnRequest,
                        returnItems,
                        dto,
                        userId,
                        manager,
                    );

                case ReturnStatus.REJECTED:

                    return this.rejectReturn(
                        returnRequest,
                        returnItems,
                        dto,
                        userId,
                        manager,
                    );

                default:

                    throw new InvalidReturnStatusError(
                        'La transición solicitada no está permitida.',
                    );
            }
        });
    }

    private async approveReturn(returnRequest: ReturnEntity, returnItems: ReturnItemEntity[], dto: UpdateReturnStatusDto, userId: number, manager: EntityManager): Promise<ReturnResponseDto> {

        if (returnRequest.status !== ReturnStatus.REQUESTED) {
            throw new InvalidReturnStatusError(
                'Solo se pueden aprobar devoluciones solicitadas.',
            );
        }

        returnRequest.status = ReturnStatus.APPROVED;
        returnRequest.processedBy = userId;
        returnRequest.updatedAt = new Date();

        if (dto.adminNotes !== undefined) {
            returnRequest.adminNotes =
                dto.adminNotes?.trim() || null;
        }

        await manager.save(
            ReturnEntity,
            returnRequest,
        );

        return ReturnMapper.toResponseDto(
            returnRequest,
            returnItems,
        );
    }

    private async rejectReturn(returnRequest: ReturnEntity,returnItems: ReturnItemEntity[],dto: UpdateReturnStatusDto,userId: number,manager: EntityManager): Promise<ReturnResponseDto> {

        if (returnRequest.status !== ReturnStatus.REQUESTED) {
            throw new InvalidReturnStatusError(
                'Solo se pueden rechazar devoluciones solicitadas.',
            );
        }

        returnRequest.status = ReturnStatus.REJECTED;
        returnRequest.processedBy = userId;
        returnRequest.updatedAt = new Date();

        if (dto.adminNotes !== undefined) {
            returnRequest.adminNotes =
                dto.adminNotes?.trim() || null;
        }

        await manager.save(
            ReturnEntity,
            returnRequest,
        );

        return ReturnMapper.toResponseDto(
            returnRequest,
            returnItems,
        );
    }

    private async paginateReturns(queryBuilder: SelectQueryBuilder<ReturnEntity>, query: ReturnQueryDto) {

        const {
            page,
            size,
            sortBy,
            sortDirection,
            status,
        } = query;

        const allowedSortFields = [
            'id',
            'status',
            'createdAt',
            'updatedAt',
        ];

        if (!allowedSortFields.includes(sortBy)) {
            throw new BadRequestException(
                'Campo de ordenamiento inválido.',
            );
        }

        if (status !== undefined) {
            queryBuilder.andWhere(
                'returnRequest.status = :status',
                { status },
            );
        }

        const totalElements = await queryBuilder.getCount();

        queryBuilder.orderBy(
            `returnRequest.${sortBy}`,
            sortDirection,
        );

        if (sortBy !== 'id') {
            queryBuilder.addOrderBy(
                'returnRequest.id',
                'ASC',
            );
        }

        const returns = await queryBuilder
            .skip(page * size)
            .take(size)
            .getMany();

        const returnItems = await this.findItemsByReturns(
            returns.map(returnRequest => returnRequest.id),
        );

        const content = returns.map(returnRequest =>
            ReturnMapper.toResponseDto(
                returnRequest,
                returnItems.filter(
                    item => item.returnId === returnRequest.id,
                ),
            ),
        );

        return {
            content,
            page,
            size,
            totalElements,
            totalPages: Math.ceil(totalElements / size),
            sortBy,
            sortDirection,
        };
    }

    private async findItemsByReturns(returnIds: number[], manager: EntityManager = this.dataSource.manager): Promise<ReturnItemEntity[]> {

        if (returnIds.length === 0) {
            return [];
        }

        return manager.find(ReturnItemEntity, {
            where: {
                returnId: In(returnIds),
            },
            relations: {
                orderItem: true,
            },
            order: {
                orderItemId: 'ASC',
            },
        });
    }

    private async findReturnedQuantities(orderItemIds: number[], manager: EntityManager): Promise<Map<number, number>> {

        const quantities = await manager
            .createQueryBuilder(ReturnItemEntity, 'item')
            .innerJoin(
                ReturnEntity,
                'returnRequest',
                'returnRequest.id = item.returnId',
            )
            .select('item.orderItemId', 'orderItemId')
            .addSelect('SUM(item.quantity)', 'quantity')
            .where('item.orderItemId IN (:...orderItemIds)', {
                orderItemIds,
            })
            .andWhere(
                'returnRequest.status IN (:...statuses)',
                {
                    statuses: [
                        ReturnStatus.REQUESTED,
                        ReturnStatus.APPROVED,
                        ReturnStatus.COMPLETED,
                    ],
                },
            )
            .groupBy('item.orderItemId')
            .getRawMany<{
                orderItemId: number;
                quantity: string;
            }>();

        return new Map(
            quantities.map(item => [
                Number(item.orderItemId),
                Number(item.quantity),
            ]),
        );
    }

    private validateReturnId(returnId: number): void {

        if (!Number.isInteger(returnId) || returnId <= 0) {
            throw new BadRequestException(
                'El identificador debe ser un número entero positivo.',
            );
        }
    }

    private async lockCustomer(customerId: number, manager: EntityManager): Promise<void> {

        const customer = await manager.findOne(CustomerEntity, {
            where: {
                id: customerId,
            },
            lock: {
                mode: 'pessimistic_write',
            },
        });

        if (!customer) {
            throw new CustomerNotFoundError();
        }
    }
}