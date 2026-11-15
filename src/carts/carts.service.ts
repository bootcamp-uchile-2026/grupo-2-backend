import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, In, Repository } from 'typeorm';
import { CartEntity } from '../models/cart.entity';
import { CartItemEntity } from '../models/cart-item.entity';
import { ProductEntity } from '../models/product.entity';
import { ProductImageEntity } from '../models/product-image.entity';
import { UserRole } from '../models/user.entity';
import { CustomersService } from '../customers/customers.service';
import { ProductsService } from '../products/products.service';
import { AddCartItemDto } from '../dto/add-cart-item.dto';
import { UpdateCartItemDto } from '../dto/update-cart-item.dto';
import { CartResponseDto } from '../dto/cart-response.dto';
import { CartNotFoundError } from '../common/errors/cart-not-found.error';
import { CartItemNotFoundError } from '../common/errors/cart-item-not-found.error';
import { CartMapper } from './cart.mapper';

@Injectable()
export class CartsService {

    constructor(
        @InjectRepository(CartEntity)
        private readonly cartRepository: Repository<CartEntity>,

        @InjectRepository(CartItemEntity)
        private readonly cartItemRepository: Repository<CartItemEntity>,

        @InjectRepository(ProductImageEntity)
        private readonly productImageRepository: Repository<ProductImageEntity>,

        private readonly customersService: CustomersService,
        private readonly productsService: ProductsService,
        private readonly dataSource: DataSource) { }

    async findOne(customerId: number, userId: number): Promise<CartResponseDto> {

        await this.customersService.validateOwnership(customerId, userId, true);

        const cart = await this.cartRepository.findOne({
            where: { customerId }
        });

        if (!cart) {
            throw new CartNotFoundError();
        }

        return this.buildResponse(cart);
    }

    async add(customerId: number, dto: AddCartItemDto, userId: number): Promise<CartResponseDto> {
        await this.customersService.validateOwnership(customerId, userId, true);

        await this.dataSource.transaction(async manager => {
            const cart = await this.findCartForUpdate(
                customerId,
                manager,
            );

            const product = await this.productsService.findPublicProduct(dto.productId);

            const item = await manager.findOne(CartItemEntity, {
                where: {
                    cartId: cart.id,
                    productId: dto.productId
                },
            });

            const quantity = (item?.quantity ?? 0) + dto.quantity;

            this.validateQuantity(product, quantity);

            if (item) {
                item.quantity = quantity;
                item.updatedAt = new Date();

                await manager.save(item);

            } else {
                const newItem = manager.create(CartItemEntity, {
                    cartId: cart.id,
                    productId: dto.productId,
                    quantity
                });
                await manager.save(newItem);
            }

            cart.updatedAt = new Date();

            await manager.save(cart);
        });
        return this.findOne(customerId, userId);
    }

    async update(customerId: number, productId: number, dto: UpdateCartItemDto, userId: number): Promise<CartResponseDto> {
        this.validateProductId(productId);

        await this.customersService.validateOwnership(customerId, userId, true);

        await this.dataSource.transaction(async manager => {

            const cart = await this.findCartForUpdate(
                customerId,
                manager,
            );

            const item = await manager.findOne(CartItemEntity, {
                where: {
                    cartId: cart.id,
                    productId,
                },
            });
            if (!item) {
                throw new CartItemNotFoundError();
            }

            const product = await this.productsService.findPublicProduct(productId);

            this.validateQuantity(product, dto.quantity);

            item.quantity = dto.quantity;
            item.updatedAt = new Date();

            await manager.save(item);

            cart.updatedAt = new Date();

            await manager.save(cart);
        });
        return this.findOne(customerId, userId);
    }

    async remove(customerId: number, productId: number, userId: number): Promise<void> {
        this.validateProductId(productId);

        await this.customersService.validateOwnership(customerId, userId, true);
        await this.dataSource.transaction(async manager => {

            const cart = await this.findCartForUpdate(
                customerId,
                manager,
            );

            const result = await manager.delete(CartItemEntity, {
                cartId: cart.id,
                productId,
            });

            if (result.affected === 0) {
                throw new CartItemNotFoundError();
            }

            cart.updatedAt = new Date();

            await manager.save(cart);
        });
    }

    async clear(customerId: number, userId: number): Promise<void> {
        await this.customersService.validateOwnership(customerId, userId, true);

        await this.dataSource.transaction(async manager => {

            const cart = await this.findCartForUpdate(
                customerId,
                manager);

            await manager.delete(CartItemEntity, {
                cartId: cart.id,
            });

            cart.updatedAt = new Date();

            await manager.save(cart)
        });
    }

    private async findCartForUpdate(customerId: number, manager: EntityManager): Promise<CartEntity> {

        const cart = await manager.findOne(CartEntity, {
            where: { customerId },
            lock: {
                mode: 'pessimistic_write'
            },
        });

        if (!cart) {
            throw new CartNotFoundError();
        }

        return cart;
    }

    private async buildResponse(cart: CartEntity): Promise<CartResponseDto> {

        const items = await this.cartItemRepository.find({
            where: {
                cartId: cart.id,
            },
            relations: {
                product: {
                    producer: {
                        user: true,
                    },
                },
            },
            order: {
                createdAt: 'ASC',
                productId: 'ASC',
            },
        });

        if (items.length === 0) {
            return CartMapper.toResponseDto(cart, []);
        }

        const productIds = items.map(item => item.productId);

        const images = await this.productImageRepository.find({
            where: {
                productId: In(productIds),
                isPrimary: true
            },
        });

        const imageMap = new Map(
            images.map(image => [
                image.productId,
                image.fileId]),
        );

        const now = new Date();

        const responseItems = items.map(item => {
            const product = item.product;
            const producerUser = product.producer.user;

            const available =
                product.isActive &&
                producerUser.isActive &&
                producerUser.role === UserRole.PRODUCER &&
                product.stock >= item.quantity;

            return CartMapper.toItemResponseDto(
                item,
                this.productsService.getActiveOfferPrice(product, now),
                this.productsService.calculateGreenPoints(
                    product.co2Avoided,
                ),
                imageMap.get(product.id) ?? null,
                available,
            );
        });

        return CartMapper.toResponseDto(cart, responseItems);
    }

    private validateQuantity(product: ProductEntity, quantity: number): void {

        if (!Number.isInteger(quantity) || quantity < 1 || quantity > 3) {
            throw new BadRequestException(
                'La cantidad debe ser un número entero entre 1 y 3.');
        }

        if (quantity > product.stock) {
            throw new ConflictException(
                'La cantidad solicitada supera el stock disponible.');
        }
    }

    private validateProductId(productId: number): void {

        if (!Number.isInteger(productId) || productId <= 0) {
            throw new BadRequestException(
                'El identificador debe ser un número entero positivo.',
            );
        }
    }
}