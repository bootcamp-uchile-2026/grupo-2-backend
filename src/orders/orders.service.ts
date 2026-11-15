import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { DataSource, EntityManager, In } from 'typeorm';
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


@Injectable()
export class OrdersService {

    private readonly shippingCost = 2990;
    private readonly maxRedemptionPercentage = 20;

    constructor(
        private readonly customersService: CustomersService,
        private readonly productsService: ProductsService,
        private readonly cartsService: CartsService,
        private readonly dataSource: DataSource) { }

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

    private async lockProducts(items: CartItemEntity[], manager: EntityManager): Promise<void> {

        const productIds = items
            .map(item => item.productId)
            .sort((a, b) => a - b);

        for (const productId of productIds) {
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

            const cart = await this.cartsService.findCartForUpdate(
                customerId,
                manager,
            );

            const address = await this.findShippingAddress(
                customerId,
                dto.addressId,
                manager,
            );

            const cartItems = await this.findCartItems(
                cart.id,
                manager,
            );

            await this.lockProducts(cartItems, manager);

            const updatedCartItems = await this.findCartItems(
                cart.id,
                manager,
            );

            const checkout = await this.calculateCheckout(
                customerId,
                address.id,
                updatedCartItems,
                dto.greenPointsToRedeem ?? 0,
                manager,
            );

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