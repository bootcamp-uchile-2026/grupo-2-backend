import { Injectable } from '@nestjs/common';
import { ProductsService } from '../productos/productos.service';
import { SubcategoryNotFoundError } from '../common/errors/subcategory-not-found.error';
import { SubcategoryProductDto } from '../dto/subcategory-product.dto';
import { Subcategory } from '../models/subcategory.model';
import { SubcategoryDto } from '../dto/subcategory.dto';
import { PopularSubcategoryProductDto } from '../dto/popular-subcategory-product.dto';

@Injectable()
export class SubcategoriesService {
  constructor(private readonly productsService: ProductsService) {}

  private readonly subcategories: Subcategory[] = [
    // Ropa y accesorios (categoría 6)
    {
      id: 1,
      categoryId: 6,
      name: 'Poleras',
      slug: 'poleras',
      imageUrl: 'https://ejemplo.cl/imagenes/subcategorias/poleras.jpg',
    },
    {
      id: 2,
      categoryId: 6,
      name: 'Pantalones',
      slug: 'pantalones',
      imageUrl: 'https://ejemplo.cl/imagenes/subcategorias/pantalones.jpg',
    },
    {
      id: 3,
      categoryId: 6,
      name: 'Polerones',
      slug: 'polerones',
      imageUrl: 'https://ejemplo.cl/imagenes/subcategorias/polerones.jpg',
    },

    // Alimentos (categoría 1)
    {
      id: 4,
      categoryId: 1,
      name: 'Conservas y mermeladas',
      slug: 'conservas-mermeladas',
      imageUrl: 'imagen-dummy-conservas',
    },
    {
      id: 5,
      categoryId: 1,
      name: 'Snacks y frutos secos',
      slug: 'snacks-frutos-secos',
      imageUrl: 'imagen-dummy-snacks',
    },

    // Cuidado personal (categoría 2)
    {
      id: 6,
      categoryId: 2,
      name: 'Jabones artesanales',
      slug: 'jabones-artesanales',
      imageUrl: 'imagen-dummy-jabones',
    },
    {
      id: 7,
      categoryId: 2,
      name: 'Cosmética natural',
      slug: 'cosmetica-natural',
      imageUrl: 'imagen-dummy-cosmetica',
    },

    // Huerto y jardinería (categoría 3)
    {
      id: 8,
      categoryId: 3,
      name: 'Semillas y almácigos',
      slug: 'semillas-almacigos',
      imageUrl: 'imagen-dummy-semillas',
    },
    {
      id: 9,
      categoryId: 3,
      name: 'Maceteros y accesorios',
      slug: 'maceteros-accesorios',
      imageUrl: 'imagen-dummy-maceteros',
    },

    // Limpieza del hogar (categoría 4)
    {
      id: 10,
      categoryId: 4,
      name: 'Productos de limpieza',
      slug: 'productos-limpieza',
      imageUrl: 'imagen-dummy-limpieza',
    },
    {
      id: 11,
      categoryId: 4,
      name: 'Accesorios reutilizables',
      slug: 'accesorios-reutilizables',
      imageUrl: 'imagen-dummy-reutilizables',
    },

    // Aromas y bienestar (categoría 5)
    {
      id: 12,
      categoryId: 5,
      name: 'Velas aromáticas',
      slug: 'velas-aromaticas',
      imageUrl: 'imagen-dummy-velas',
    },
    {
      id: 13,
      categoryId: 5,
      name: 'Aceites esenciales',
      slug: 'aceites-esenciales',
      imageUrl: 'imagen-dummy-aceites',
    },

    // Ropa y accesorios (categoría 6)
    {
      id: 14,
      categoryId: 6,
      name: 'Bolsos y accesorios',
      slug: 'bolsos-accesorios',
      imageUrl: 'imagen-dummy-bolsos',
    },

    // Mascotas (categoría 7)
    {
      id: 15,
      categoryId: 7,
      name: 'Accesorios para mascotas',
      slug: 'accesorios-mascotas',
      imageUrl: 'imagen-dummy-mascotas',
    },
    {
      id: 16,
      categoryId: 7,
      name: 'Higiene y cuidado',
      slug: 'higiene-cuidado-mascotas',
      imageUrl: 'imagen-dummy-higiene-mascotas',
    },

    // Decoración y artesanías (categoría 8)
    {
      id: 17,
      categoryId: 8,
      name: 'Cerámica artesanal',
      slug: 'ceramica-artesanal',
      imageUrl: 'imagen-dummy-ceramica',
    },
    {
      id: 18,
      categoryId: 8,
      name: 'Decoración sustentable',
      slug: 'decoracion-sustentable',
      imageUrl: 'imagen-dummy-decoracion',
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

    return this.productsService
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

    return this.productsService
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
