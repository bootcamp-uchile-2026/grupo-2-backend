import { BadRequestException, Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { FavoriteEntity } from '../models/favorite.entity';
import { FavoriteProductDto } from '../dto/favorite-product.dto';
import { CustomersService } from '../customers/customers.service';
import { ProductsService } from '../products/products.service';
import { FavoriteAlreadyExistsError } from '../common/errors/favorite-already-exists.error';
import { FavoriteNotFoundError } from '../common/errors/favorite-not-found.error';
import { ProductNotFoundError } from '../common/errors/product-not-found.error';

@Injectable()
export class FavoritesService {

    constructor(
        @InjectRepository(FavoriteEntity)
        private readonly favoriteRepository:Repository<FavoriteEntity>,
        private readonly customersService: CustomersService,
        private readonly productsService: ProductsService) {}

    async findAll(customerId: number): Promise<FavoriteProductDto[]> {
        this.validateId(customerId);

        await this.customersService.findOne(customerId);

        const favorites = await this.favoriteRepository.find({
            where: {
                customerId,
            },
            order: {
                createdAt: 'DESC',
                productId: 'ASC',
            },
        });

        const products: FavoriteProductDto[] = [];

        for (const favorite of favorites) {
            try {
                const product =
                    await this.productsService.findFavoriteProduct(
                        favorite.productId,
                    );

                products.push(product);

            } catch (error) {

                if (!(error instanceof ProductNotFoundError)) {
                    throw error;
                }
            }
        }

        return products;
    }

    async add(customerId: number,productId: number): Promise<FavoriteProductDto> {
        this.validateId(customerId);
        this.validateId(productId);

        await this.customersService.findOne(customerId);

        const product =
            await this.productsService.findFavoriteProduct(
                productId,
            );

        const existingFavorite =
            await this.favoriteRepository.findOne({
                where: {
                    customerId,
                    productId,
                },
            });

        if (existingFavorite) {
            throw new FavoriteAlreadyExistsError();
        }

        try {

            await this.favoriteRepository.insert({
                customerId,
                productId,
            });

        } catch (error) {

            if (
                error instanceof QueryFailedError &&
                error.driverError.code === '23505'
            ) {
                throw new FavoriteAlreadyExistsError();
            }

            throw error;
        }

        return product;
    }

    async remove(customerId: number,productId: number): Promise<void> {

        this.validateId(customerId);
        this.validateId(productId);

        await this.customersService.findOne(customerId);

        const result = await this.favoriteRepository.delete({
            customerId,
            productId,
        });

        if (result.affected === 0) {
            throw new FavoriteNotFoundError();
        }
    }

    private validateId(id: number): void {

        if (!Number.isInteger(id) || id <= 0 ) {
            throw new BadRequestException(
                'El identificador debe ser un número entero positivo.');
        }
    }
}
