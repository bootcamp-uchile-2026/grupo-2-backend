import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FavoriteEntity } from '../models/favorite.entity';
import { FavoriteProductDto } from '../dto/favorite-product.dto';
import { CustomersService } from '../customers/customers.service';
import { ProductsService } from '../products/products.service';
import { FavoriteAlreadyExistsError } from '../common/errors/favorite-already-exists.error';
import { FavoriteNotFoundError } from '../common/errors/favorite-not-found.error';

@Injectable()
export class FavoritesService {

    constructor(
        @InjectRepository(FavoriteEntity)
        private readonly favoriteRepository: Repository<FavoriteEntity>,
        private readonly customersService: CustomersService,
        private readonly productsService: ProductsService) { }

    async findAll(customerId: number): Promise<FavoriteProductDto[]> {
        await this.customersService.validateCustomer(customerId);

        return this.productsService.findFavoriteProducts(customerId);
    }

    async add(customerId: number, productId: number): Promise<FavoriteProductDto> {
        await this.customersService.validateCustomer(customerId);

        const product = await this.productsService.findFavoriteProduct(productId);

        const existingFavorite = await this.favoriteRepository.findOne({
            where: { customerId, productId },
        });

        if (existingFavorite) {
            throw new FavoriteAlreadyExistsError();
        }

        await this.favoriteRepository.insert({ customerId, productId });

        return product;
    }

    async remove(customerId: number, productId: number): Promise<void> {
        if (!Number.isInteger(productId) || productId <= 0) {
            throw new BadRequestException(
                'El identificador debe ser un número entero positivo.',
            );
        }

        await this.customersService.validateCustomer(customerId);

        const result = await this.favoriteRepository.delete({
            customerId,
            productId,
        });

        if (result.affected === 0) {
            throw new FavoriteNotFoundError();
        }
    }
}
