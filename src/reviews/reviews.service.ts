import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { CustomersService } from '../customers/customers.service';
import { ReviewEntity } from '../models/review.entity';
import { CustomerEntity } from '../models/customer.entity';
import { ProductEntity } from '../models/product.entity';
import { OrderEntity, OrderStatus } from '../models/order.entity';
import { OrderItemEntity } from '../models/order-item.entity';
import { GreenPointMovementEntity, GreenPointMovementType } from '../models/green-point-movement.entity';
import { PaginationDto } from '../dto/pagination.dto';
import { CreateReviewDto } from '../dto/create-review.dto';
import { UpdateReviewDto } from '../dto/update-review.dto';
import { CustomerReviewDto } from '../dto/customer-review.dto';
import { CustomerNotFoundError } from '../common/errors/customer-not-found.error';
import { ProductNotFoundError } from '../common/errors/product-not-found.error';
import { ReviewNotFoundError } from '../common/errors/review-not-found.error';
import { ReviewAlreadyExistsError } from '../common/errors/review-already-exists.error';
import { ReviewNotAllowedError } from '../common/errors/review-not-allowed.error';

import { ReviewMapper } from './review.mapper';

@Injectable()
export class ReviewsService {

    private readonly reviewGreenPoints = 5;

    constructor(
        private readonly customersService: CustomersService,
        private readonly dataSource: DataSource) { }

    async findAll(customerId: number, pagination: PaginationDto, userId: number) {

        await this.customersService.validateOwnership(customerId, userId, true);

        const {
            page,
            size,
            sortBy,
            sortDirection,
        } = pagination;

        const allowedSortFields = [
            'id',
            'rating',
            'createdAt',
            'updatedAt',
        ];

        if (!allowedSortFields.includes(sortBy)) {
            throw new BadRequestException(
                'Campo de ordenamiento inválido.',
            );
        }

        const queryBuilder = this.dataSource.manager
            .createQueryBuilder(ReviewEntity, 'review')
            .innerJoinAndSelect('review.product', 'product')
            .where('review.customerId = :customerId', {
                customerId,
            });

        const totalElements = await queryBuilder.getCount();

        queryBuilder.orderBy(
            `review.${sortBy}`,
            sortDirection,
        );

        if (sortBy !== 'id') {
            queryBuilder.addOrderBy('review.id', 'ASC');
        }

        const reviews = await queryBuilder
            .skip(page * size)
            .take(size)
            .getMany();

        const content = reviews.map(review =>
            ReviewMapper.toResponseDto(review),
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

    async create(customerId: number, dto: CreateReviewDto, userId: number): Promise<CustomerReviewDto> {

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

            const product = await manager.findOne(ProductEntity, {
                where: {
                    id: dto.productId,
                },
            });

            if (!product) {
                throw new ProductNotFoundError();
            }

            const existingReview = await manager.findOne(
                ReviewEntity,
                {
                    where: {
                        customerId,
                        productId: dto.productId,
                    },
                },
            );

            if (existingReview) {
                throw new ReviewAlreadyExistsError();
            }

            await this.validateDeliveredPurchase(
                customerId,
                dto.productId,
                manager,
            );

            const now = new Date();

            const review = await manager.save(ReviewEntity, {
                customerId,
                productId: product.id,
                rating: dto.rating,
                comment: dto.comment?.trim() || null,
                createdAt: now,
                updatedAt: now,
            });

            await manager.save(GreenPointMovementEntity, {
                customerId,
                type: GreenPointMovementType.REVIEW,
                points: this.reviewGreenPoints,
                orderId: null,
                returnId: null,
                reviewId: review.id,
                description: 'Puntos verdes por valoración de producto',
                createdAt: now,
            });

            review.product = product;

            return ReviewMapper.toResponseDto(review);
        });
    }

    async update(customerId: number, reviewId: number, dto: UpdateReviewDto, userId: number): Promise<CustomerReviewDto> {

        if (!Number.isInteger(reviewId) || reviewId <= 0) {
            throw new BadRequestException(
                'El identificador debe ser un número entero positivo.',
            );
        }

        if (
            dto.rating === undefined &&
            dto.comment === undefined
        ) {
            throw new BadRequestException(
                'Debe proporcionar una calificación o un comentario.',
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

            const review = await manager.findOne(ReviewEntity, {
                where: {
                    id: reviewId,
                    customerId,
                },
                relations: {
                    product: true,
                },
            });

            if (!review) {
                throw new ReviewNotFoundError();
            }

            if (dto.rating !== undefined) {
                review.rating = dto.rating;
            }

            if (dto.comment !== undefined) {
                review.comment = dto.comment?.trim() || null;
            }

            review.updatedAt = new Date();

            await manager.save(ReviewEntity, review);

            return ReviewMapper.toResponseDto(review);
        });
    }

    private async validateDeliveredPurchase(customerId: number, productId: number, manager: EntityManager): Promise<void> {

        const purchase = await manager
            .createQueryBuilder(OrderItemEntity, 'item')
            .innerJoin(
                OrderEntity,
                'order',
                'order.id = item.orderId',
            )
            .where('order.customerId = :customerId', {
                customerId,
            })
            .andWhere('item.productId = :productId', {
                productId,
            })
            .andWhere('order.status = :status', {
                status: OrderStatus.DELIVERED,
            })
            .getOne();

        if (!purchase) {
            throw new ReviewNotAllowedError();
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