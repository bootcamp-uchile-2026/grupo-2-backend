import { Injectable } from '@nestjs/common';
import { ProductosService } from '../productos/productos.service';
import { SubcategoryNotFoundError } from '../common/errors/subcategory-not-found.error';
import { SubcategoryProductDto } from '../model/dtos/subcategory-product.dto';
import { Subcategory } from '../model/subcategory.model';
import { SubcategoryDto } from '../model/dtos/subcategory.dto';
import { PopularSubcategoryProductDto } from '../model/dtos/popular-subcategory-product.dto';

@Injectable()
export class SubcategoriasService {

  constructor(private readonly productosService: ProductosService) {}

  private readonly subcategories: Subcategory[] = [
    {
      id: 1,
      categoryId: 3,
      name: 'Poleras',
      slug: 'poleras',
      imageUrl:
        'https://ejemplo.cl/imagenes/subcategorias/poleras.jpg',
    },
    {
      id: 2,
      categoryId: 3,
      name: 'Pantalones',
      slug: 'pantalones',
      imageUrl:
        'https://ejemplo.cl/imagenes/subcategorias/pantalones.jpg',
    },
    {
      id: 3,
      categoryId: 3,
      name: 'Polerones',
      slug: 'polerones',
      imageUrl:
        'https://ejemplo.cl/imagenes/subcategorias/polerones.jpg',
    },
  ];

  validateSubcategoryExists(subcategoryId: number): void {
    const subcategoryExists = this.subcategories.some(
      (subcategory) => subcategory.id === subcategoryId,
    );

    if (!subcategoryExists) {
      throw new SubcategoryNotFoundError();
    }
  }

  findByCategory(categoryId: number): SubcategoryDto[] {
    return this.subcategories
      .filter(
        (subcategory) => subcategory.categoryId === categoryId,
      )
      .map((subcategory) => ({
        id: subcategory.id,
        name: subcategory.name,
        slug: subcategory.slug,
        imageUrl: subcategory.imageUrl,
      }));
  }

  findProductsBySubcategory(subcategoryId: number): SubcategoryProductDto[] {
    this.validateSubcategoryExists(subcategoryId);

    return this.productosService
      .findProductsBySubcategory(subcategoryId)
      .map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        imageUrl: product.imageUrl,
        stock: product.stock,
      }));
  }

  findPopularProducts(subcategoryId: number, quantity = 4): PopularSubcategoryProductDto[] {
    this.validateSubcategoryExists(subcategoryId);

    const maxQuantity = Math.min(quantity, 4);

    return this.productosService
      .findProductsBySubcategory(subcategoryId)
      .filter((product) => product.stock > 0)
      .sort((a, b) => b.salesLastMonth - a.salesLastMonth)
      .slice(0, maxQuantity)
      .map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
      }));
  }
}
