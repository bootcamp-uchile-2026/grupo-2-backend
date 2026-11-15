import { BadRequestException, Injectable} from '@nestjs/common';
import { FavoriteAlreadyExistsError } from '../common/errors/favorite-already-exists.error';
import { FavoriteNotFoundError } from '../common/errors/favorite-not-found.error';
import { ProductNotFoundError } from '../common/errors/product-not-found.error';
import { CustomersService } from '../customers/customers.service';
import { ProductsService } from '../products/products.service';
import { FavoriteProductDto } from '../dto/favorite-product.dto';
import { Favorite } from '../models/favorite.model';

@Injectable()
export class FavoritesService {

    constructor(
        private readonly customersService:
            CustomersService,

        private readonly productsService:
            ProductsService,
    ) { }

    private readonly favorites: Favorite[] = [];

    async findAll(
        customerId: number,
    ): Promise<FavoriteProductDto[]> {

        this.validateId(customerId);

        await this.customersService.findOne(
            customerId,
        );

        const customerFavorites =
            this.favorites.filter(
                (favorite) =>
                    favorite.customerId === customerId,
            );

        const products: FavoriteProductDto[] = [];

        for (const favorite of customerFavorites) {

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

    async add(
        customerId: number,
        productId: number,
    ): Promise<FavoriteProductDto> {

        this.validateId(customerId);
        this.validateId(productId);

        await this.customersService.findOne(
            customerId,
        );

        const product =
            await this.productsService.findFavoriteProduct(
                productId,
            );

        const existingFavorite =
            this.favorites.find(
                (favorite) =>
                    favorite.customerId === customerId &&
                    favorite.productId === productId,
            );

        if (existingFavorite) {
            throw new FavoriteAlreadyExistsError();
        }

        this.favorites.push({
            customerId,
            productId,
        });

        return product;
    }

    async remove(
        customerId: number,
        productId: number,
    ): Promise<void> {

        this.validateId(customerId);
        this.validateId(productId);

        await this.customersService.findOne(
            customerId,
        );

        const favoriteIndex =
            this.favorites.findIndex(
                (favorite) =>
                    favorite.customerId === customerId &&
                    favorite.productId === productId,
            );

        if (favoriteIndex === -1) {
            throw new FavoriteNotFoundError();
        }

        this.favorites.splice(
            favoriteIndex,
            1,
        );
    }

    private validateId(id: number): void {

        if (
            !Number.isInteger(id) ||
            id <= 0
        ) {

            throw new BadRequestException(
                'El identificador debe ser un número entero positivo.',
            );
        }
    }
}
