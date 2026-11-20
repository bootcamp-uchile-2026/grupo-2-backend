import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { DataSource, EntityManager, In, SelectQueryBuilder } from 'typeorm';
import { CustomersService } from '../customers/customers.service';
import { ProductsService } from '../products/products.service';
import { CartsService } from '../carts/carts.service';
import { CartEntity } from '../models/cart.entity';
import { CartItemEntity } from '../models/cart-item.entity';
import { AddressEntity } from '../models/address.entity';
import { ProductEntity } from '../models/product.entity';
import { ProductImageEntity } from '../models/product-image.entity';
import { UserRole } from '../models/user.entity';
import { CheckoutPreviewDto } from '../dto/checkout-preview.dto';
import { CheckoutPreviewResponseDto } from '../dto/checkout-preview-response.dto';
import { CheckoutItemResponseDto } from '../dto/checkout-item-response.dto';
import { CartNotFoundError } from '../common/errors/cart-not-found.error';
import { AddressNotFoundError } from '../common/errors/address-not-found.error';
import { EmptyCartError } from '../common/errors/empty-cart.error';
import { InsufficientStockError } from '../common/errors/insufficient-stock.error';
import { InsufficientGreenPointsError } from '../common/errors/insufficient-green-points.error';
import { CreateOrderDto } from 'src/dto/create-order.dto';
import { OrderResponseDto } from 'src/dto/order-response.dto';
import { CustomerEntity } from 'src/models/customer.entity';
import { CustomerNotFoundError } from 'src/common/errors/customer-not-found.error';
import { CheckoutTotalChangedError } from 'src/common/errors/checkout-total-changed.error';
import { OrderEntity, OrderStatus, PaymentStatus } from 'src/models/order.entity';
import { OrderItemEntity } from 'src/models/order-item.entity';
import { GreenPointMovementEntity, GreenPointMovementType } from 'src/models/green-point-movement.entity';
import { OrderMapper } from './order.mapper';
import { OrderQueryDto } from 'src/dto/order-query.dto';
import { OrderNotFoundError } from 'src/common/errors/order-not-found.error';
import { ProducersService } from 'src/producers/producers.service';
import { ProducerOrderDetailDto } from 'src/dto/producer-order-detail.dto';
import { OrderItemNotFoundError } from 'src/common/errors/order-item-not-found.error';
import { InvalidOrderStatusError } from 'src/common/errors/invalid-order-status.error';
import { UpdateOrderStatusDto } from 'src/dto/update-order-status.dto';
import { StatisticsQueryDto } from 'src/dto/statistics-query.dto';
import { OrderStatisticsDto } from 'src/dto/order-statistics.dto';


@Injectable()
export class OrdersService {

    private readonly shippingCost = 2990;
    private readonly maxRedemptionPercentage = 20;

    constructor(
        private readonly customersService: CustomersService,
        private readonly productsService: ProductsService,
        private readonly cartsService: CartsService,
        private readonly dataSource: DataSource,
        private readonly producersService: ProducersService,) { }

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

    private async lockProducts(productIds: number[], manager: EntityManager): Promise<void> {

        const sortedProductIds = [...productIds]
            .sort((a, b) => a - b);

        for (const productId of sortedProductIds) {

            const product = await manager.findOne(ProductEntity, {
                where: {
                    id: productId,
                },
                lock: {
                    mode: 'pessimistic_write',
                },
            });

            if (!product) {
                throw new ConflictException(
                    'Uno de los productos ya no está disponible.',
                );
            }
        }
    }

    async preview(customerId: number, dto: CheckoutPreviewDto, userId: number): Promise<CheckoutPreviewResponseDto> {
        const manager = this.dataSource.manager;

        await this.customersService.validateOwnership(customerId, userId, true, manager);

        const address = await this.findShippingAddress(customerId, dto.addressId, manager);

        const cart = await this.findCart(customerId, manager);

        const items = await this.findCartItems(cart.id, manager);

        return this.calculateCheckout(
            customerId,
            address.id,
            items,
            dto.greenPointsToRedeem ?? 0,
            manager,
        );
    }

    async confirm(customerId: number, dto: CreateOrderDto, userId: number): Promise<OrderResponseDto> {

        return this.dataSource.transaction(async manager => {

            await this.customersService.validateOwnership(customerId, userId, true, manager);

            await this.lockCustomer(customerId, manager);

            await this.customersService.validateOwnership(customerId, userId, true, manager);

            const cart = await this.cartsService.findCartForUpdate(customerId, manager);

            const address = await this.findShippingAddress(customerId, dto.addressId, manager);

            const cartItems = await this.findCartItems(cart.id, manager);

            await this.lockProducts(
                cartItems.map(item => item.productId),
                manager,
            );
            const updatedCartItems = await this.findCartItems(cart.id, manager);

            const checkout = await this.calculateCheckout(customerId, address.id, updatedCartItems, dto.greenPointsToRedeem ?? 0, manager);

            if (checkout.total !== dto.expectedTotal) {
                throw new CheckoutTotalChangedError();
            }

            const now = new Date();

            const order = await manager.save(OrderEntity, {
                customerId,
                addressId: address.id,
                status: OrderStatus.CONFIRMED,
                paymentMethod: dto.paymentMethod,
                paymentStatus: PaymentStatus.PAID,
                shippingCost: checkout.shippingCost,
                shippingRecipientName: address.recipientName,
                shippingRecipientPhone: address.recipientPhone,
                shippingStreet: address.street,
                shippingStreetNumber: address.streetNumber,
                shippingApartment: address.apartment,
                shippingCommune: address.commune,
                shippingRegion: address.region,
                shippingReference: address.reference,
                createdAt: now,
                updatedAt: now,
                confirmedAt: now,
                shippedAt: null,
                deliveredAt: null,
                cancelledAt: null,
            });

            const orderItems: OrderItemEntity[] = [];

            for (const item of checkout.items) {

                const product = updatedCartItems.find(
                    cartItem => cartItem.productId === item.productId,
                )!.product;

                const details =
                    await this.productsService.findSpecializedDetails(
                        product,
                        manager,
                    );

                const orderItem = await manager.save(OrderItemEntity, {
                    orderId: order.id,
                    productId: product.id,
                    productName: product.name,
                    productDescription: product.description,
                    productSize:
                        typeof details?.size === 'string'
                            ? details.size
                            : null,
                    productColor:
                        typeof details?.color === 'string'
                            ? details.color
                            : null,
                    productMaterial:
                        typeof details?.material === 'string'
                            ? details.material
                            : null,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    unitCo2Avoided: product.co2Avoided,
                    unitGreenPoints: item.unitGreenPoints,
                    greenPointDiscount: item.greenPointDiscount,
                    isPrepared: false,
                    preparedAt: null,
                });

                orderItems.push(orderItem);

                await manager.update(
                    ProductEntity,
                    product.id,
                    {
                        stock: product.stock - item.quantity,
                        updatedAt: now,
                    },
                );
            }

            if (checkout.greenPointsRedeemed > 0) {

                await manager.save(GreenPointMovementEntity, {
                    customerId,
                    type: GreenPointMovementType.REDEMPTION,
                    points: -checkout.greenPointsRedeemed,
                    orderId: order.id,
                    returnId: null,
                    reviewId: null,
                    description: 'Canje de puntos verdes en compra',
                    createdAt: now,
                });
            }

            await manager.delete(CartItemEntity, {
                cartId: cart.id,
            });

            await manager.update(CartEntity, cart.id, {
                updatedAt: now,
            });
            return OrderMapper.toResponseDto(order, orderItems);
        });
    }

    async findOrdersByCustomer(customerId: number, query: OrderQueryDto, userId: number) {

        await this.customersService.validateOwnership(customerId, userId, true);

        const queryBuilder = this.dataSource.manager
            .createQueryBuilder(OrderEntity, 'order')
            .where('order.customerId = :customerId', {
                customerId,
            });

        return this.paginateOrders(queryBuilder, query);
    }

    async findOrderByCustomer(customerId: number, orderId: number, userId: number): Promise<OrderResponseDto> {
        await this.customersService.validateOwnership(customerId, userId, true);

        if (!Number.isInteger(orderId) || orderId <= 0) {
            throw new BadRequestException(
                'El identificador debe ser un número entero positivo.',
            );
        }

        const order = await this.dataSource.manager.findOne(
            OrderEntity,
            {
                where: {
                    id: orderId,
                    customerId,
                },
            },
        );

        if (!order) {
            throw new OrderNotFoundError();
        }

        const orderItems = await this.findItemsByOrders([
            order.id,
        ]);

        return OrderMapper.toResponseDto(order, orderItems);
    }

    async findAllOrders(query: OrderQueryDto) {

        const queryBuilder = this.dataSource.manager
            .createQueryBuilder(OrderEntity, 'order');

        return this.paginateOrders(queryBuilder, query);
    }

    async findOrderByAdmin(orderId: number): Promise<OrderResponseDto> {

        if (!Number.isInteger(orderId) || orderId <= 0) {
            throw new BadRequestException(
                'El identificador debe ser un número entero positivo.',
            );
        }

        const order = await this.dataSource.manager.findOne(
            OrderEntity,
            {
                where: {
                    id: orderId,
                },
            },
        );

        if (!order) {
            throw new OrderNotFoundError();
        }

        const orderItems = await this.findItemsByOrders([
            order.id,
        ]);

        return OrderMapper.toResponseDto(
            order,
            orderItems,
        );
    }
    async findOrdersByProducer(producerId: number, query: OrderQueryDto, userId: number) {
        await this.producersService.validateOwnership(producerId, userId);

        const { page, size, sortBy, sortDirection, status } = query;

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

        const queryBuilder = this.dataSource.manager
            .createQueryBuilder(OrderEntity, 'order')
            .innerJoin(
                OrderItemEntity,
                'item',
                'item.orderId = order.id',
            )
            .innerJoin(
                ProductEntity,
                'product',
                'product.id = item.productId',
            )
            .where('product.producerId = :producerId', {
                producerId,
            })
            .distinct(true);

        if (status !== undefined) {
            queryBuilder.andWhere('order.status = :status', {
                status,
            });
        }

        const totalElements = await queryBuilder.getCount();

        queryBuilder.orderBy(`order.${sortBy}`, sortDirection);

        if (sortBy !== 'id') {
            queryBuilder.addOrderBy('order.id', 'ASC');
        }

        const orders = await queryBuilder
            .offset(page * size)
            .limit(size)
            .getMany();

        const orderItems = await this.findItemsByProducer(
            producerId,
            orders.map(order => order.id),
        );

        const content = orders.map(order =>
            OrderMapper.toProducerSummaryDto(
                order,
                orderItems.filter(item => item.orderId === order.id),
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

    async cancelOrderByCustomer(customerId: number, orderId: number, userId: number): Promise<OrderResponseDto> {

        if (!Number.isInteger(orderId) || orderId <= 0) {
            throw new BadRequestException(
                'El identificador debe ser un número entero positivo.',
            );
        }

        return this.dataSource.transaction(async manager => {

            await this.customersService.validateOwnership(
                customerId,
                userId,
                true,
                manager,
            );

            await this.lockCustomer(
                customerId,
                manager,
            );

            const order = await manager.findOne(OrderEntity, {
                where: {
                    id: orderId,
                    customerId,
                },
                lock: {
                    mode: 'pessimistic_write',
                },
            });

            if (!order) {
                throw new OrderNotFoundError();
            }

            if (order.status !== OrderStatus.CONFIRMED) {
                throw new InvalidOrderStatusError(
                    'El cliente solo puede cancelar pedidos confirmados.',
                );
            }

            const orderItems = await this.findItemsByOrders(
                [order.id],
                manager,
            );

            return this.cancelOrder(
                order,
                orderItems,
                manager,
            );
        });
    }

    async updateOrderStatus(orderId: number, dto: UpdateOrderStatusDto): Promise<OrderResponseDto> {

        if (!Number.isInteger(orderId) || orderId <= 0) {
            throw new BadRequestException(
                'El identificador debe ser un número entero positivo.',
            );
        }

        return this.dataSource.transaction(async manager => {

            const existingOrder = await manager.findOne(OrderEntity, {
                where: {
                    id: orderId,
                },
            });

            if (!existingOrder) {
                throw new OrderNotFoundError();
            }

            await this.lockCustomer(
                existingOrder.customerId,
                manager,
            );

            const order = await manager.findOne(OrderEntity, {
                where: {
                    id: orderId,
                },
                lock: {
                    mode: 'pessimistic_write',
                },
            });

            if (!order) {
                throw new OrderNotFoundError();
            }

            const orderItems = await this.findItemsByOrders(
                [order.id],
                manager,
            );

            switch (dto.status) {

                case OrderStatus.SHIPPED:

                    return this.shipOrder(
                        order,
                        orderItems,
                        manager,
                    );

                case OrderStatus.DELIVERED:

                    return this.deliverOrder(
                        order,
                        orderItems,
                        manager,
                    );

                case OrderStatus.CANCELLED:

                    return this.cancelOrder(
                        order,
                        orderItems,
                        manager,
                    );

                default:

                    throw new InvalidOrderStatusError(
                        'La transición solicitada no está permitida.',
                    );
            }
        });
    }

    async getStatistics(query: StatisticsQueryDto): Promise<OrderStatisticsDto> {

        const orders = await this.dataSource.query(
            `
        SELECT
            COUNT(*) AS "totalOrders",

            COUNT(*) FILTER (
                WHERE status = 'PENDING'
            ) AS "pendingOrders",

            COUNT(*) FILTER (
                WHERE status = 'CONFIRMED'
            ) AS "confirmedOrders",

            COUNT(*) FILTER (
                WHERE status = 'PREPARING'
            ) AS "preparingOrders",

            COUNT(*) FILTER (
                WHERE status = 'SHIPPED'
            ) AS "shippedOrders",

            COUNT(*) FILTER (
                WHERE status = 'DELIVERED'
            ) AS "deliveredOrders",

            COUNT(*) FILTER (
                WHERE status = 'CANCELLED'
            ) AS "cancelledOrders"

        FROM orders
        `,
        );

        const sales = await this.dataSource.query(
            `
        SELECT
            COALESCE(
                SUM(
                    oi.quantity - COALESCE(returned.quantity, 0)
                ),
                0
            ) AS "netUnitsSold",

            COALESCE(
                SUM(
                    (oi.quantity - COALESCE(returned.quantity, 0))
                    * oi.unit_price
                ),
                0
            ) AS "netSales",

            COALESCE(
                SUM(
                    (oi.quantity - COALESCE(returned.quantity, 0))
                    * oi.unit_co2_avoided
                ),
                0
            ) AS "co2Avoided"

        FROM order_items oi
        JOIN orders o ON o.id = oi.order_id

        LEFT JOIN (
            SELECT
                ri.order_item_id,
                SUM(ri.quantity) AS quantity
            FROM return_items ri
            JOIN returns r ON r.id = ri.return_id
            WHERE r.status = 'COMPLETED'
            GROUP BY ri.order_item_id
        ) returned ON returned.order_item_id = oi.id

        WHERE o.status = 'DELIVERED'
          AND (
              $1::text IS NULL
              OR o.delivered_at >= (
                  DATE_TRUNC(
                      $1::text,
                      NOW() AT TIME ZONE 'America/Santiago'
                  ) AT TIME ZONE 'America/Santiago'
              )
          )
        `,
            [query.period ?? null],
        );

        return {
            totalOrders:
                Number(orders[0].totalOrders),

            pendingOrders:
                Number(orders[0].pendingOrders),

            confirmedOrders:
                Number(orders[0].confirmedOrders),

            preparingOrders:
                Number(orders[0].preparingOrders),

            shippedOrders:
                Number(orders[0].shippedOrders),

            deliveredOrders:
                Number(orders[0].deliveredOrders),

            cancelledOrders:
                Number(orders[0].cancelledOrders),

            netUnitsSold:
                Number(sales[0].netUnitsSold),

            netSales:
                Number(sales[0].netSales),

            co2Avoided:
                Number(sales[0].co2Avoided),
        };
    }

    private async shipOrder(order: OrderEntity, orderItems: OrderItemEntity[], manager: EntityManager): Promise<OrderResponseDto> {

        if (order.status !== OrderStatus.PREPARING) {
            throw new InvalidOrderStatusError(
                'Solo se pueden despachar pedidos en preparación.',
            );
        }

        if (order.paymentStatus !== PaymentStatus.PAID) {
            throw new InvalidOrderStatusError(
                'El pedido debe estar pagado para ser despachado.',
            );
        }

        if (orderItems.length === 0) {
            throw new InvalidOrderStatusError(
                'El pedido no contiene productos.',
            );
        }

        if (orderItems.some(item => !item.isPrepared)) {
            throw new InvalidOrderStatusError(
                'Todos los productos deben estar preparados antes del despacho.',
            );
        }

        const now = new Date();

        order.status = OrderStatus.SHIPPED;
        order.shippedAt = now;
        order.updatedAt = now;

        await manager.save(OrderEntity, order);

        return OrderMapper.toResponseDto(
            order,
            orderItems,
        );
    }

    private async deliverOrder(order: OrderEntity, orderItems: OrderItemEntity[], manager: EntityManager): Promise<OrderResponseDto> {
        if (order.status !== OrderStatus.SHIPPED) {
            throw new InvalidOrderStatusError(
                'Solo se pueden entregar pedidos despachados.',
            );
        }

        if (order.paymentStatus !== PaymentStatus.PAID) {
            throw new InvalidOrderStatusError(
                'El pedido debe estar pagado para ser entregado.',
            );
        }

        if (orderItems.length === 0) {
            throw new InvalidOrderStatusError(
                'El pedido no contiene productos.',
            );
        }

        const now = new Date();

        order.status = OrderStatus.DELIVERED;
        order.deliveredAt = now;
        order.updatedAt = now;

        const response = OrderMapper.toResponseDto(order, orderItems);

        await manager.save(OrderEntity, order);

        if (response.estimatedGreenPoints > 0) {

            await manager.save(GreenPointMovementEntity, {
                customerId: order.customerId,
                type: GreenPointMovementType.PURCHASE,
                points: response.estimatedGreenPoints,
                orderId: order.id,
                returnId: null,
                reviewId: null,
                description: 'Puntos verdes por compra entregada',
                createdAt: now,
            });
        }
        return response;
    }
    async prepareOrderItem(producerId: number, orderId: number, itemId: number, userId: number): Promise<ProducerOrderDetailDto> {

        if (!Number.isInteger(orderId) || orderId <= 0 ||
            !Number.isInteger(itemId) || itemId <= 0) {

            throw new BadRequestException(
                'Los identificadores deben ser números enteros positivos.',
            );
        }

        return this.dataSource.transaction(async manager => {

            await this.producersService.validateOwnership(producerId, userId, manager);

            const order = await manager.findOne(OrderEntity, {
                where: {
                    id: orderId,
                },
                lock: {
                    mode: 'pessimistic_write',
                },
            });

            if (!order) {
                throw new OrderNotFoundError();
            }

            const orderItems = await this.findItemsByProducer(
                producerId,
                [orderId],
                manager,
            );

            if (orderItems.length === 0) {
                throw new OrderNotFoundError();
            }

            const item = orderItems.find(
                item => item.id === itemId,
            );

            if (!item) {
                throw new OrderItemNotFoundError();
            }

            const allowedStatuses = [
                OrderStatus.CONFIRMED,
                OrderStatus.PREPARING,
            ];

            if (!allowedStatuses.includes(order.status)) {
                throw new InvalidOrderStatusError(
                    'El estado actual del pedido no permite preparar sus productos.',
                );
            }

            if (item.isPrepared) {
                return OrderMapper.toProducerDetailDto(
                    order,
                    orderItems,
                );
            }

            const now = new Date();

            item.isPrepared = true;
            item.preparedAt = now;

            await manager.save(OrderItemEntity, item);

            if (order.status === OrderStatus.CONFIRMED) {
                order.status = OrderStatus.PREPARING;
            }

            order.updatedAt = now;

            await manager.save(OrderEntity, order);

            return OrderMapper.toProducerDetailDto(
                order,
                orderItems,
            );
        });
    }

    async findOrderByProducer(producerId: number, orderId: number, userId: number): Promise<ProducerOrderDetailDto> {

        await this.producersService.validateOwnership(producerId, userId);

        if (!Number.isInteger(orderId) || orderId <= 0) {
            throw new BadRequestException(
                'El identificador debe ser un número entero positivo.',
            );
        }

        const order = await this.dataSource.manager.findOne(
            OrderEntity,
            {
                where: {
                    id: orderId,
                },
            },
        );

        if (!order) {
            throw new OrderNotFoundError();
        }

        const orderItems = await this.findItemsByProducer(
            producerId,
            [order.id],
        );

        if (orderItems.length === 0) {
            throw new OrderNotFoundError();
        }

        return OrderMapper.toProducerDetailDto(
            order,
            orderItems,
        );
    }

    private async findItemsByProducer(producerId: number, orderIds: number[], manager: EntityManager = this.dataSource.manager): Promise<OrderItemEntity[]> {

        if (orderIds.length === 0) {
            return [];
        }

        return manager
            .createQueryBuilder(OrderItemEntity, 'item')
            .innerJoin(
                ProductEntity,
                'product',
                'product.id = item.productId',
            )
            .where('product.producerId = :producerId', {
                producerId,
            })
            .andWhere('item.orderId IN (:...orderIds)', {
                orderIds,
            })
            .orderBy('item.id', 'ASC')
            .getMany();
    }

    private async findShippingAddress(customerId: number, addressId: number, manager: EntityManager): Promise<AddressEntity> {
        const address = await manager.findOne(AddressEntity, {
            where: {
                id: addressId,
                customerId,
                isActive: true,
            },
        });

        if (!address) {
            throw new AddressNotFoundError();
        }

        return address;
    }

    private async findItemsByOrders(orderIds: number[], manager: EntityManager = this.dataSource.manager): Promise<OrderItemEntity[]> {

        if (orderIds.length === 0) {
            return [];
        }

        return manager.find(OrderItemEntity, {
            where: {
                orderId: In(orderIds),
            },
            order: {
                id: 'ASC',
            },
        });
    }

    private async findCart(customerId: number, manager: EntityManager): Promise<CartEntity> {

        const cart = await manager.findOne(CartEntity, {
            where: { customerId },
        });

        if (!cart) {
            throw new CartNotFoundError();
        }

        return cart;
    }

    private async findCartItems(cartId: number, manager: EntityManager): Promise<CartItemEntity[]> {

        const items = await manager.find(CartItemEntity, {
            where: {
                cartId,
            },
            relations: {
                product: {
                    producer: {
                        user: true,
                    },
                    category: true,
                },
            },
            order: {
                productId: 'ASC',
            },
        });

        if (items.length === 0) {
            throw new EmptyCartError();
        }

        return items;
    }

    private async calculateCheckout(customerId: number, addressId: number, items: CartItemEntity[], greenPointsToRedeem: number, manager: EntityManager): Promise<CheckoutPreviewResponseDto> {

        const now = new Date();

        const productIds = items.map(item => item.productId);

        const images = await manager.find(ProductImageEntity, {
            where: {
                productId: In(productIds),
                isPrimary: true,
            },
        });

        const imageMap = new Map(images.map(image => [
            image.productId,
            image.fileId,
        ]),
        );

        const responseItems: CheckoutItemResponseDto[] =
            items.map(item => {

                const product = item.product;

                this.validateProductAvailability(product, item.quantity);

                const unitPrice = this.productsService.getActiveOfferPrice(product, now) ?? product.price;

                const unitGreenPoints = this.productsService.calculateGreenPoints(product.co2Avoided);

                const unitCo2Avoided = Number(product.co2Avoided);

                const subtotal = unitPrice * item.quantity;

                return {
                    productId: product.id,
                    productName: product.name,
                    producerId: product.producerId,
                    producerName: product.producer.businessName,
                    primaryImageFileId:
                        imageMap.get(product.id) ?? null,
                    quantity: item.quantity,
                    unitPrice,
                    subtotal,
                    greenPointDiscount: 0,
                    total: subtotal,
                    unitCo2Avoided,
                    unitGreenPoints,
                    co2Avoided: Number(
                        (unitCo2Avoided * item.quantity).toFixed(4),
                    ),
                    greenPoints:
                        unitGreenPoints * item.quantity,
                };
            });

        const subtotal = responseItems.reduce((total, item) => total + item.subtotal, 0);

        const availableGreenPoints = await this.customersService.getGreenPointsBalance(customerId, manager);

        const maxDiscount = Math.floor(subtotal * this.maxRedemptionPercentage / 100);

        const maxGreenPointsToRedeem = Math.max(0, Math.min(availableGreenPoints, maxDiscount));

        this.validateRedemption(
            greenPointsToRedeem,
            availableGreenPoints,
            maxDiscount,
        );

        this.distributeDiscount(
            responseItems,
            subtotal,
            greenPointsToRedeem,
        );

        const totalItems = responseItems.reduce(
            (total, item) => total + item.quantity,
            0,
        );

        const estimatedGreenPoints = responseItems.reduce(
            (total, item) => total + item.greenPoints,
            0,
        );

        const estimatedCo2Avoided = Number(
            responseItems.reduce(
                (total, item) => total + item.co2Avoided,
                0,
            ).toFixed(4),
        );

        return {
            customerId,
            addressId,
            items: responseItems,
            totalProducts: responseItems.length,
            totalItems,
            subtotal,
            shippingCost: this.shippingCost,
            availableGreenPoints,
            maxGreenPointsToRedeem,
            greenPointsRedeemed: greenPointsToRedeem,
            remainingGreenPoints:
                availableGreenPoints - greenPointsToRedeem,
            estimatedGreenPoints,
            estimatedCo2Avoided,
            total:
                subtotal +
                this.shippingCost -
                greenPointsToRedeem,
        };
    }

    private validateProductAvailability(product: ProductEntity, quantity: number): void {

        if (!Number.isInteger(quantity) ||
            quantity < 1 ||
            quantity > 3
        ) {
            throw new BadRequestException(
                'La cantidad debe ser un número entero entre 1 y 3.',
            );
        }

        const producerUser = product.producer.user;

        if (
            !product.isActive ||
            !producerUser.isActive ||
            producerUser.role !== UserRole.PRODUCER
        ) {
            throw new ConflictException(
                `El producto ${product.name} no está disponible.`,
            );
        }

        if (quantity > product.stock) {
            throw new InsufficientStockError(product.name);
        }
    }

    private validateRedemption(greenPointsToRedeem: number, availableGreenPoints: number, maxDiscount: number): void {

        if (!Number.isInteger(greenPointsToRedeem) ||
            greenPointsToRedeem < 0
        ) {
            throw new BadRequestException(
                'La cantidad de puntos verdes debe ser un número entero mayor o igual a cero.',
            );
        }

        if (greenPointsToRedeem === 0) {
            return;
        }

        if (greenPointsToRedeem > maxDiscount) {
            throw new BadRequestException(
                'El canje de puntos verdes no puede superar el 20% del subtotal.',
            );
        }

        if (greenPointsToRedeem > availableGreenPoints) {
            throw new InsufficientGreenPointsError();
        }
    }

    private async paginateOrders(queryBuilder: SelectQueryBuilder<OrderEntity>, query: OrderQueryDto) {

        const { page, size, sortBy, sortDirection, status } = query;

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
            queryBuilder.andWhere('order.status = :status', {
                status,
            });
        }

        const totalElements = await queryBuilder.getCount();

        queryBuilder.orderBy(`order.${sortBy}`, sortDirection);

        if (sortBy !== 'id') {
            queryBuilder.addOrderBy('order.id', 'ASC');
        }

        const orders = await queryBuilder
            .offset(page * size)
            .limit(size)
            .getMany();

        const orderItems = await this.findItemsByOrders(
            orders.map(order => order.id),
        );

        const content = orders.map(order =>
            OrderMapper.toSummaryDto(
                order,
                orderItems.filter(item => item.orderId === order.id),
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

    private async cancelOrder(order: OrderEntity, orderItems: OrderItemEntity[], manager: EntityManager): Promise<OrderResponseDto> {

        const allowedStatuses = [
            OrderStatus.PENDING,
            OrderStatus.CONFIRMED,
            OrderStatus.PREPARING,
        ];

        if (!allowedStatuses.includes(order.status)) {
            throw new InvalidOrderStatusError(
                'El estado actual del pedido no permite su cancelación.',
            );
        }

        const now = new Date();

        if (order.status === OrderStatus.CONFIRMED ||
            order.status === OrderStatus.PREPARING) {

            await this.lockProducts(
                orderItems.map(item => item.productId),
                manager,
            );

            for (const item of orderItems) {

                await manager.increment(
                    ProductEntity,
                    { id: item.productId },
                    'stock',
                    item.quantity,
                );

                await manager.update(
                    ProductEntity,
                    item.productId,
                    {
                        updatedAt: now,
                    },
                );
            }

            const redemption = await manager.findOne(
                GreenPointMovementEntity,
                {
                    where: {
                        orderId: order.id,
                        customerId: order.customerId,
                        type: GreenPointMovementType.REDEMPTION,
                    },
                },
            );

            if (redemption) {

                await manager.save(GreenPointMovementEntity, {
                    customerId: order.customerId,
                    type: GreenPointMovementType.REFUND,
                    points: -redemption.points,
                    orderId: order.id,
                    returnId: null,
                    reviewId: null,
                    description: 'Restitución de puntos verdes por cancelación',
                    createdAt: now,
                });
            }
        }

        if (order.paymentStatus === PaymentStatus.PAID) {
            order.paymentStatus = PaymentStatus.REFUNDED;
        }

        order.status = OrderStatus.CANCELLED;
        order.cancelledAt = now;
        order.updatedAt = now;

        await manager.save(OrderEntity, order);

        return OrderMapper.toResponseDto(
            order,
            orderItems,
        );
    }

    private distributeDiscount(items: CheckoutItemResponseDto[], subtotal: number, greenPointsToRedeem: number): void {
        if (greenPointsToRedeem === 0) {
            return;
        }

        const totalSubtotal = BigInt(subtotal);
        const points = BigInt(greenPointsToRedeem);

        const distribution = items.map(item => {

            const numerator =
                points * BigInt(item.subtotal);

            const discount = numerator / totalSubtotal;

            const remainder = numerator % totalSubtotal;

            item.greenPointDiscount = Number(discount);

            return {
                item,
                remainder,
            };
        });

        const assignedDiscount = items.reduce(
            (total, item) =>
                total + item.greenPointDiscount,
            0,
        );

        const remainingDiscount =
            greenPointsToRedeem - assignedDiscount;

        distribution.sort((a, b) => {

            if (a.remainder > b.remainder) {
                return -1;
            }

            if (a.remainder < b.remainder) {
                return 1;
            }

            return a.item.productId - b.item.productId;
        });

        for (let i = 0; i < remainingDiscount; i++) {
            distribution[i].item.greenPointDiscount++;
        }

        for (const item of items) {
            item.total =
                item.subtotal - item.greenPointDiscount;
        }
    }
}