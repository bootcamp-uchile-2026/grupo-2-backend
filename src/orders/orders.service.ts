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

@Injectable()
export class OrdersService {

    private readonly shippingCost = 2990;
    private readonly maxRedemptionPercentage = 20;

    constructor(
        private readonly customersService: CustomersService,
        private readonly productsService: ProductsService,
        private readonly cartsService: CartsService,
        private readonly dataSource: DataSource) { }

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

    private validateRedemption(greenPointsToRedeem: number,availableGreenPoints: number,maxDiscount: number): void {

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

        const distribution = items.map(item => {

            const proportionalDiscount =
                greenPointsToRedeem * item.subtotal / subtotal;

            const discount = Math.floor(proportionalDiscount);

            item.greenPointDiscount = discount;

            return {
                item,
                remainder: proportionalDiscount - discount,
            };
        });

        const assignedDiscount = items.reduce(
            (total, item) =>
                total + item.greenPointDiscount,
            0,
        );

        const remainingDiscount =
            greenPointsToRedeem - assignedDiscount;

        distribution.sort((a, b) =>
            b.remainder - a.remainder ||
            a.item.productId - b.item.productId,
        );

        for (let i = 0; i < remainingDiscount; i++) {
            distribution[i].item.greenPointDiscount++;
        }

        for (const item of items) {
            item.total =
                item.subtotal - item.greenPointDiscount;
        }
    }
}