import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource, EntityManager, In, SelectQueryBuilder } from 'typeorm';
import { CustomersService } from '../customers/customers.service';
import { CustomerEntity } from '../models/customer.entity';
import { OrderEntity, OrderStatus, PaymentStatus } from '../models/order.entity';
import { OrderItemEntity } from '../models/order-item.entity';
import { ReturnEntity, ReturnStatus } from '../models/return.entity';
import { ReturnItemEntity } from '../models/return-item.entity';
import { ProductEntity } from '../models/product.entity';
import { GreenPointMovementEntity, GreenPointMovementType } from '../models/green-point-movement.entity';
import { ProductNotFoundError } from '../common/errors/product-not-found.error';
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

                case ReturnStatus.COMPLETED:

                    return this.completeReturn(
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

    private async rejectReturn(returnRequest: ReturnEntity, returnItems: ReturnItemEntity[], dto: UpdateReturnStatusDto, userId: number, manager: EntityManager): Promise<ReturnResponseDto> {

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

    private async completeReturn(returnRequest: ReturnEntity, returnItems: ReturnItemEntity[], dto: UpdateReturnStatusDto, userId: number, manager: EntityManager): Promise<ReturnResponseDto> {

        if (returnRequest.status !== ReturnStatus.APPROVED) {
            throw new InvalidReturnStatusError(
                'Solo se pueden completar devoluciones aprobadas.',
            );
        }

        const order = returnRequest.order;

        const allowedPaymentStatuses = [
            PaymentStatus.PAID,
            PaymentStatus.PARTIALLY_REFUNDED,
        ];

        if (!allowedPaymentStatuses.includes(order.paymentStatus)) {
            throw new InvalidReturnError(
                'El estado del pago no permite completar la devolución.',
            );
        }

        const restockOrderItemIds = dto.restockOrderItemIds ?? [];

        for (const orderItemId of restockOrderItemIds) {

            const item = returnItems.find(
                item => item.orderItemId === orderItemId,
            );

            if (!item) {
                throw new InvalidReturnError(
                    'Uno de los ítems indicados para reposición no pertenece a la devolución.',
                );
            }
        }

        const previousItems = await this.findCompletedReturnItems(
            order.id,
            manager,
        );

        for (const item of returnItems) {

            const orderItem = item.orderItem;

            if (orderItem.orderId !== order.id) {
                throw new InvalidReturnError(
                    'Uno de los ítems no pertenece al pedido.',
                );
            }

            const previousQuantity = previousItems
                .filter(previous =>
                    previous.orderItemId === item.orderItemId,
                )
                .reduce(
                    (total, previous) => total + previous.quantity,
                    0,
                );

            if (previousQuantity + item.quantity > orderItem.quantity) {
                throw new InvalidReturnError(
                    `La devolución supera las unidades compradas de ${orderItem.productName}.`,
                );
            }
        }

        const productIds = returnItems
            .filter(item =>
                restockOrderItemIds.includes(item.orderItemId),
            )
            .map(item => item.orderItem.productId);

        await this.lockProducts(productIds, manager);

        const now = new Date();

        let totalGreenPointsRestored = 0;
        let totalGreenPointsReversed = 0;

        for (const item of returnItems) {

            const orderItem = item.orderItem;

            const previousReturns = previousItems.filter(
                previous =>
                    previous.orderItemId === item.orderItemId,
            );

            const previousQuantity = previousReturns.reduce(
                (total, previous) => total + previous.quantity,
                0,
            );

            const previouslyRestoredPoints = previousReturns.reduce(
                (total, previous) =>
                    total + previous.greenPointsRestored,
                0,
            );

            const accumulatedQuantity =
                previousQuantity + item.quantity;

            const accumulatedRestoredPoints = Math.floor(
                orderItem.greenPointDiscount *
                accumulatedQuantity /
                orderItem.quantity,
            );

            const greenPointsRestored =
                accumulatedRestoredPoints -
                previouslyRestoredPoints;

            const grossAmount =
                orderItem.unitPrice * item.quantity;

            if (
                greenPointsRestored < 0 ||
                greenPointsRestored > grossAmount
            ) {
                throw new InvalidReturnError(
                    'La restitución de puntos verdes es inconsistente con el historial del pedido.',
                );
            }

            item.greenPointsRestored = greenPointsRestored;

            item.refundAmount =
                grossAmount - greenPointsRestored;

            item.restock = restockOrderItemIds.includes(
                item.orderItemId,
            );

            totalGreenPointsRestored +=
                item.greenPointsRestored;

            totalGreenPointsReversed +=
                orderItem.unitGreenPoints * item.quantity;

            await manager.save(
                ReturnItemEntity,
                item,
            );

            if (item.restock) {

                await manager.increment(
                    ProductEntity,
                    {
                        id: orderItem.productId,
                    },
                    'stock',
                    item.quantity,
                );

                await manager.update(
                    ProductEntity,
                    orderItem.productId,
                    {
                        updatedAt: now,
                    },
                );
            }
        }

        if (totalGreenPointsReversed > 0) {

            await manager.save(GreenPointMovementEntity, {
                customerId: order.customerId,
                type: GreenPointMovementType.RETURN,
                points: -totalGreenPointsReversed,
                orderId: null,
                returnId: returnRequest.id,
                reviewId: null,
                description: 'Reversión de puntos verdes por devolución',
                createdAt: now,
            });
        }

        if (totalGreenPointsRestored > 0) {

            await manager.save(GreenPointMovementEntity, {
                customerId: order.customerId,
                type: GreenPointMovementType.REFUND,
                points: totalGreenPointsRestored,
                orderId: null,
                returnId: returnRequest.id,
                reviewId: null,
                description: 'Restitución de puntos verdes canjeados',
                createdAt: now,
            });
        }

        returnRequest.status = ReturnStatus.COMPLETED;
        returnRequest.processedBy = userId;
        returnRequest.completedAt = now;
        returnRequest.updatedAt = now;

        if (dto.adminNotes !== undefined) {
            returnRequest.adminNotes =
                dto.adminNotes?.trim() || null;
        }

        await manager.save(
            ReturnEntity,
            returnRequest,
        );

        await this.updateOrderPaymentStatus(
            order,
            manager,
        );

        return ReturnMapper.toResponseDto(
            returnRequest,
            returnItems,
        );
    }

    private async updateOrderPaymentStatus(order: OrderEntity, manager: EntityManager): Promise<void> {
        const orderItems = await manager.find(
            OrderItemEntity,
            {
                where: {
                    orderId: order.id,
                },
            },
        );

        if (orderItems.length === 0) {
            throw new InvalidReturnError(
                'El pedido no contiene productos.',
            );
        }

        const completedItems =
            await this.findCompletedReturnItems(
                order.id,
                manager,
            );

        const allItemsReturned = orderItems.every(
            orderItem => {

                const returnedQuantity = completedItems
                    .filter(item =>
                        item.orderItemId === orderItem.id,
                    )
                    .reduce(
                        (total, item) => total + item.quantity,
                        0,
                    );

                return returnedQuantity === orderItem.quantity;
            },
        );

        order.paymentStatus = allItemsReturned
            ? PaymentStatus.REFUNDED
            : PaymentStatus.PARTIALLY_REFUNDED;

        order.updatedAt = new Date();

        await manager.save(
            OrderEntity,
            order,
        );
    }

    private async lockProducts( productIds: number[], manager: EntityManager): Promise<void> {

        const sortedProductIds = [...new Set(productIds)]
            .sort((a, b) => a - b);

        for (const productId of sortedProductIds) {

            const product = await manager.findOne(
                ProductEntity,
                {
                    where: {
                        id: productId,
                    },
                    lock: {
                        mode: 'pessimistic_write',
                    },
                },
            );

            if (!product) {
                throw new ProductNotFoundError();
            }
        }
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

    private async findCompletedReturnItems(orderId: number, manager: EntityManager): Promise<ReturnItemEntity[]> {
        return manager
            .createQueryBuilder(ReturnItemEntity, 'item')
            .innerJoin(
                'item.returnRequest',
                'returnRequest',
            )
            .where('returnRequest.orderId = :orderId', {
                orderId,
            })
            .andWhere('returnRequest.status = :status', {
                status: ReturnStatus.COMPLETED,
            })
            .getMany();
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