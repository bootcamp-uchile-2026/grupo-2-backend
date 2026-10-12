import { Injectable } from '@nestjs/common';
import { ProductNotFoundError } from '../common/errors/product-not-found.error';
import { Product } from '../models/product.model';
import { GreenFootprint } from '../models/green-footprint.model';
import { Review } from '../models/review.model';
import { ProductSearchDto } from '../dto/product-search.dto';
import { ProductOfferDto } from '../dto/product-offer.dto';
import { BestSellingProductDto } from '../dto/best-selling-product.dto';
import { NewProductSummaryDto } from '../dto/new-product-summary.dto';
import { ProductDetailDto } from '../dto/product-detail.dto';
import { ProductGreenFootprintDto } from '../dto/product-green-footprint.dto';
import { ProductReviewDto } from '../dto/product-review.dto';
import { RelatedProductDto } from '../dto/related-product.dto';
import { ProductSummaryDto } from '../dto/product-summary.dto';

@Injectable()
export class ProductsService {
  private readonly products: Product[] = [
    {
      id: 1,
      subcategoryId: 1,
      entrepreneurId: 1,
      brand: 'EcoWear',
      name: 'Polera de algodón orgánico',
      description: 'Polera confeccionada con algodón orgánico.',
      price: 12990,
      salePrice: 9990,
      imageUrl: 'https:polera.jpg',
      images: ['https:polera.jpg', 'https:polera-2.jpg'],
      stock: 25,
      rating: 4.7,
      salesLastMonth: 50,
      createdAt: new Date('2026-08-20'),
      colors: ['Blanco', 'Negro', 'Verde'],
      sizes: ['S', 'M', 'L', 'XL'],
    },
    {
      id: 2,
      subcategoryId: 1,
      entrepreneurId: 1,
      brand: 'EcoWear',
      name: 'Polera manga larga',
      description: 'Polera de algodón de manga larga.',
      price: 15990,
      salePrice: null,
      imageUrl: 'https:polera-larga.jpg',
      images: ['https:olera-larga.jpg'],
      stock: 15,
      rating: 4.5,
      salesLastMonth: 35,
      createdAt: new Date('2026-08-18'),
      colors: ['Negro', 'Gris'],
      sizes: ['S', 'M', 'L'],
    },
    {
      id: 3,
      subcategoryId: 2,
      entrepreneurId: 2,
      brand: 'VerdeVida',
      name: 'Polera básica',
      description: 'Polera básica de algodón.',
      price: 9990,
      salePrice: 7990,
      imageUrl: 'https:polera-basica.jpg',
      images: ['https:polera-basica.jpg'],
      stock: 20,
      rating: 4.2,
      salesLastMonth: 25,
      createdAt: new Date('2026-08-15'),
      colors: ['Blanco', 'Negro'],
      sizes: ['S', 'M', 'L', 'XL'],
    },
    {
      id: 4,
      subcategoryId: 2,
      entrepreneurId: 2,
      brand: 'NaturalFit',
      name: 'Polera deportiva',
      description: 'Polera para actividades deportivas.',
      price: 18990,
      salePrice: null,
      imageUrl: 'https:polera-deportiva.jpg',
      images: ['https:polera-deportiva.jpg'],
      stock: 10,
      rating: 4.8,
      salesLastMonth: 20,
      createdAt: new Date('2026-08-10'),
      colors: ['Negro', 'Azul'],
      sizes: ['M', 'L', 'XL'],
    },
    {
      id: 5,
      subcategoryId: 3,
      entrepreneurId: 2,
      brand: 'VerdeVida',
      name: 'Polera estampada',
      description: 'Polera estampada de algodón.',
      price: 14990,
      salePrice: 11990,
      imageUrl: 'https:polera-estampada.jpg',
      images: [
        'https:polera-estampada.jpg',
        'https:polera-estampada-2.jpg',
      ],
      stock: 8,
      rating: null,
      salesLastMonth: 15,
      createdAt: new Date('2026-08-05'),
      colors: ['Blanco', 'Verde'],
      sizes: ['S', 'M', 'L'],
    },
  ];

  private readonly greenFootprints: GreenFootprint[] = [
    {
      productId: 1,
      sustainabilityRating: 4.8,
      materials: ['Algodón orgánico', 'Tintes naturales'],
      productionProcess:
        'Producto confeccionado utilizando algodón orgánico y procesos de bajo impacto ambiental.',
    },
    {
      productId: 2,
      sustainabilityRating: 4.5,
      materials: ['Algodón orgánico'],
      productionProcess:
        'Producto elaborado con materiales de origen sustentable.',
    },
    {
      productId: 3,
      sustainabilityRating: null,
      materials: ['Algodón'],
      productionProcess: null,
    },
  ];

  private readonly reviews: Review[] = [
    {
      id: 1,
      productId: 1,
      author: 'María',
      comment: 'Muy buen producto y excelente calidad.',
      rating: 5,
      published: true,
    },
    {
      id: 2,
      productId: 1,
      author: 'Carlos',
      comment: 'Buena calidad y materiales.',
      rating: 4,
      published: true,
    },
    {
      id: 3,
      productId: 1,
      author: 'Andrea',
      comment: 'Comentario pendiente de moderación.',
      rating: 3,
      published: false,
    },
    {
      id: 4,
      productId: 2,
      author: 'Pedro',
      comment: 'Producto cómodo y de buena terminación.',
      rating: 4,
      published: true,
    },
  ];

  searchProducts(search: string): ProductSearchDto[] {
    const filteredProducts = this.products.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase()),
    );

    return filteredProducts.map((product) => ({
      id: product.id,
      brand: product.brand,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl ?? '',
    }));
  }

  findProductsOnSale(): ProductOfferDto[] {
    const productsOnSale = this.products.filter(
      (product) => product.salePrice !== null,
    );

    return productsOnSale.map((product) => {
      const discountedPrice = product.salePrice as number;

      return {
        id: product.id,
        brand: product.brand,
        name: product.name,
        originalPrice: product.price,
        discountedPrice,
        discountPercentage: Math.round(
          ((product.price - discountedPrice) / product.price) * 100,
        ),
        imageUrl: product.imageUrl ?? '',
      };
    });
  }

  findBestSellingProducts(quantity: number): BestSellingProductDto[] {
    const sortedProducts = [...this.products].sort(
      (a, b) => b.salesLastMonth - a.salesLastMonth,
    );

    return sortedProducts.slice(0, quantity).map((product) => ({
      id: product.id,
      brand: product.brand,
      name: product.name,
      price: product.price,
      rating: product.rating,
      imageUrl: product.imageUrl,
    }));
  }

  findNewProducts(): NewProductSummaryDto[] {
    const sortedProducts = [...this.products].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );

    return sortedProducts.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      salePrice: product.salePrice,
      imageUrl: product.imageUrl,
    }));
  }

  findOne(productId: number): ProductDetailDto {
    const product = this.products.find(
      (item) => item.id === productId,
    );

    if (!product) {
      throw new ProductNotFoundError();
    }

    return {
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      images: product.images,
      colors: product.colors,
      sizes: product.sizes,
    };
  }

  findGreenFootprint(productId: number): ProductGreenFootprintDto {
    const product = this.products.find(
      (item) => item.id === productId,
    );

    if (!product) {
      throw new ProductNotFoundError();
    }

    const footprint = this.greenFootprints.find(
      (item) => item.productId === productId,
    );

    if (!footprint) {
      return {
        sustainabilityRating: null,
        materials: [],
        productionProcess: null,
      };
    }

    return {
      sustainabilityRating: footprint.sustainabilityRating,
      materials: footprint.materials,
      productionProcess: footprint.productionProcess,
    };
  }

  findReviews(productId: number): ProductReviewDto[] {
    const product = this.products.find(
      (item) => item.id === productId,
    );

    if (!product) {
      throw new ProductNotFoundError();
    }

    const publishedReviews = this.reviews.filter(
      (review) =>
        review.productId === productId && review.published,
    );

    return publishedReviews.map((review) => ({
      id: review.id,
      author: review.author,
      comment: review.comment,
      rating: review.rating,
    }));
  }

  findRelatedProducts(
    productId: number,
    quantity: number,
  ): RelatedProductDto[] {
    const product = this.products.find(
      (item) => item.id === productId,
    );

    if (!product) {
      throw new ProductNotFoundError();
    }

    const relatedProducts = this.products
      .filter(
        (item) =>
          item.subcategoryId === product.subcategoryId &&
          item.id !== productId,
      )
      .sort(
        (a, b) => b.salesLastMonth - a.salesLastMonth,
      )
      .slice(0, quantity);

    return relatedProducts.map((item) => ({
      id: item.id,
      brand: item.brand,
      name: item.name,
      price: item.price,
      imageUrl: item.imageUrl,
    }));
  }

  findProductsBySubcategory(subcategoryId: number): Product[] {
    return this.products.filter(
      (product) => product.subcategoryId === subcategoryId,
    );
  }

  findProductsByEntrepreneur(
    entrepreneurId: number,
  ): ProductSummaryDto[] {
    const entrepreneurProducts = this.products.filter(
      (product) => product.entrepreneurId === entrepreneurId,
    );

    return entrepreneurProducts.map((product) => ({
      id: product.id,
      brand: product.brand,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
    }));
  }
}
