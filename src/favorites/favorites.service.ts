import { BadRequestException, Injectable } from '@nestjs/common';
import { FavoriteAlreadyExistsError } from '../common/errors/favorite-already-exists.error';
import { FavoriteNotFoundError } from '../common/errors/favorite-not-found.error';
import { CustomersService } from '../customers/customers.service';
import { ProductsService } from '../productos/productos.service';
import { FavoriteProductDto } from '../dto/favorite-product.dto';
import { Favorite } from '../models/favorite.model';

@Injectable()
export class FavoritesService {
  
  constructor(
    private readonly customersService: CustomersService,
    private readonly productsService: ProductsService,
  ) {}

    private readonly favorites: Favorite[] = [];


  findAll(customerId: number): FavoriteProductDto[] {
    this.validateId(customerId);
    this.customersService.findOne(customerId);

    const customerFavorites = this.favorites.filter(
      (favorite) => favorite.customerId === customerId,
    );

    return customerFavorites.map((favorite) =>
      this.productsService.findFavoriteProduct(favorite.productId),
    );
  }

  add(customerId: number, productId: number): FavoriteProductDto {
    this.validateId(customerId);
    this.validateId(productId);
    this.customersService.findOne(customerId);

    const product = this.productsService.findFavoriteProduct(productId);

    const existingFavorite = this.favorites.find(
      (favorite) =>
        favorite.customerId === customerId &&
        favorite.productId === productId,
    );

    if (existingFavorite) {
      throw new FavoriteAlreadyExistsError();
    }

    const newFavorite: Favorite = {
      customerId: customerId,
      productId: productId,
    };

    this.favorites.push(newFavorite);

    return product;
  }

  remove(customerId: number, productId: number): void {
    this.validateId(customerId);
    this.validateId(productId);
    this.customersService.findOne(customerId);
    this.productsService.findFavoriteProduct(productId);

    const favoriteIndex = this.favorites.findIndex(
      (favorite) =>
        favorite.customerId === customerId &&
        favorite.productId === productId,
    );

    if (favoriteIndex === -1) {
      throw new FavoriteNotFoundError();
    }

    this.favorites.splice(favoriteIndex, 1);
  }

  private validateId(id: number): void {
    if (id <= 0) {
      throw new BadRequestException(
        'El identificador debe ser un número entero positivo.',
      );
    }
  }
}
