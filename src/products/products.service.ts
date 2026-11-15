import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder, In, EntityManager } from 'typeorm';
import { ProductEntity } from '../models/product.entity';
import { ProductImageEntity } from '../models/product-image.entity';
import { ReviewEntity } from '../models/review.entity';
import { UserRole } from '../models/user.entity';
import { ProductSustainabilityAttributeEntity } from '../models/product-sustainability-attribute.entity';
import { FoodDetailEntity } from '../models/food-detail.entity';
import { PersonalCareDetailEntity } from '../models/personal-care-detail.entity';
import { GardenDetailEntity } from '../models/garden-detail.entity';
import { HomeCleaningDetailEntity } from '../models/home-cleaning-detail.entity';
import { WellnessDetailEntity } from '../models/wellness-detail.entity';
import { ClothingDetailEntity } from '../models/clothing-detail.entity';
import { PetDetailEntity } from '../models/pet-detail.entity';
import { CraftDetailEntity } from '../models/craft-detail.entity';
import { PaginationDto } from '../dto/pagination.dto';
import { ProductQueryDto } from '../dto/product-query.dto';
import { ProductSummaryDto } from '../dto/product-summary.dto';
import { ProductDetailDto } from '../dto/product-detail.dto';
import { BestSellingProductDto } from '../dto/best-selling-product.dto';
import { ProductGreenFootprintDto } from '../dto/product-green-footprint.dto';
import { ProductReviewDto } from '../dto/product-review.dto';
import { FavoriteProductDto } from '../dto/favorite-product.dto';
import { ProductNotFoundError } from '../common/errors/product-not-found.error';
import { ProductMapper } from './product.mapper';
import { FavoriteEntity } from '../models/favorite.entity';

@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(ProductEntity)
    private readonly productsRepository: Repository<ProductEntity>,

    @InjectRepository(ProductImageEntity)
    private readonly productImagesRepository: Repository<ProductImageEntity>,

    @InjectRepository(ReviewEntity)
    private readonly reviewsRepository: Repository<ReviewEntity>,

    @InjectRepository(ProductSustainabilityAttributeEntity)
    private readonly sustainabilityRepository: Repository<ProductSustainabilityAttributeEntity>,

    @InjectRepository(FoodDetailEntity)
    private readonly foodDetailsRepository: Repository<FoodDetailEntity>,

    @InjectRepository(PersonalCareDetailEntity)
    private readonly personalCareDetailsRepository: Repository<PersonalCareDetailEntity>,

    @InjectRepository(GardenDetailEntity)
    private readonly gardenDetailsRepository: Repository<GardenDetailEntity>,

    @InjectRepository(HomeCleaningDetailEntity)
    private readonly homeCleaningDetailsRepository: Repository<HomeCleaningDetailEntity>,

    @InjectRepository(WellnessDetailEntity)
    private readonly wellnessDetailsRepository: Repository<WellnessDetailEntity>,

    @InjectRepository(ClothingDetailEntity)
    private readonly clothingDetailsRepository: Repository<ClothingDetailEntity>,

    @InjectRepository(PetDetailEntity)
    private readonly petDetailsRepository: Repository<PetDetailEntity>,

    @InjectRepository(CraftDetailEntity)
    private readonly craftDetailsRepository: Repository<CraftDetailEntity>) { }

  async findAll(query: ProductQueryDto) {
    const now = new Date();
    const queryBuilder = this.createPublicProductsQuery();

    if (query.search && query.search.trim() !== '') {
      queryBuilder.andWhere('product.name ILIKE :search', {
        search: `%${query.search.trim()}%`
      });
    }

    if (query.categoryId !== undefined) {
      queryBuilder.andWhere('product.categoryId = :categoryId', {
        categoryId: query.categoryId
      });
    }

    if (query.producerId !== undefined) {
      queryBuilder.andWhere('product.producerId = :producerId', {
        producerId: query.producerId
      });
    }

    return this.paginateProducts(queryBuilder, query, now);
  }

  async findProductsOnSale(pagination: PaginationDto) {

    const now = new Date();

    const queryBuilder = this.createPublicProductsQuery()
      .andWhere('product.offerPrice IS NOT NULL')
      .andWhere('product.offerStartAt <= :now', { now })
      .andWhere('product.offerEndAt > :now', { now });

    return this.paginateProducts(queryBuilder, pagination, now);
  }

  async findNewProducts(pagination: PaginationDto) {

    return this.paginateProducts(
      this.createPublicProductsQuery(),
      pagination,
      new Date(),
    );
  }

  async findBestSellingProducts(quantity: number): Promise<BestSellingProductDto[]> {
    this.validateQuantity(quantity);

    const now = new Date();
    const since = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const sales: {
      productId: number;
      unitsSold: string;
    }[] = await this.productsRepository.query(
      `
        SELECT
            oi.product_id AS "productId",
            SUM(oi.quantity - COALESCE(returned.quantity, 0)) AS "unitsSold"
        FROM order_items oi
        JOIN orders o ON o.id = oi.order_id
        JOIN products p ON p.id = oi.product_id
        JOIN producers pr ON pr.id = p.producer_id
        JOIN users u ON u.id = pr.user_id
        LEFT JOIN (
            SELECT
                ri.order_item_id,
                SUM(ri.quantity) AS quantity
            FROM return_items ri
            JOIN returns r ON r.id = ri.return_id
            WHERE r.status = 'COMPLETED'
              AND r.completed_at <= $2
            GROUP BY ri.order_item_id
        ) returned ON returned.order_item_id = oi.id
        WHERE o.status = 'DELIVERED'
          AND o.delivered_at >= $1
          AND o.delivered_at <= $2
          AND p.is_active = true
          AND u.is_active = true
          AND u.role = 'PRODUCER'
        GROUP BY oi.product_id
        HAVING SUM(oi.quantity - COALESCE(returned.quantity, 0)) > 0
        ORDER BY "unitsSold" DESC, oi.product_id ASC
        LIMIT $3
        `,
      [since, now, quantity],
    );

    if (sales.length === 0) {
      return []
    }

    const productIds = sales.map(sale => Number(sale.productId));

    const products = await this.createPublicProductsQuery()
      .andWhere('product.id IN (:...productIds)', { productIds })
      .getMany();

    const summaries = await this.toSummaryDtos(products, now);

    const productMap = new Map(summaries.map(product => [product.id, product]));

    const result: BestSellingProductDto[] = [];

    for (const sale of sales) {
      const product = productMap.get(Number(sale.productId));

      if (product) {
        result.push({
          ...product,
          unitsSold: Number(sale.unitsSold),
        });
      }
    }
    return result;
  }

  async findOne(productId: number): Promise<ProductDetailDto> {
    const product = await this.findPublicProduct(productId);

    const [summary] = await this.toSummaryDtos([product], new Date());

    const images = await this.productImagesRepository.find({
      where: { productId },
      order: { displayOrder: 'ASC' },
    });

    const details = await this.findSpecializedDetails(product);

    return {
      ...summary,
      description: product.description,
      categoryName: product.category.name,
      imageFileIds: images.map(image => image.fileId),
      details,
    }
  }

  async findGreenFootprint(productId: number): Promise<ProductGreenFootprintDto> {
    const product = await this.findPublicProduct(productId);

    const attributes = await this.sustainabilityRepository.find({
      where: { productId },
      relations: { sustainabilityAttribute: true },
      order: { sustainabilityAttributeId: 'ASC' },
    });

    return {
      productId: product.id,
      co2Avoided: Number(product.co2Avoided),
      greenPoints: this.calculateGreenPoints(product.co2Avoided),
      sustainabilityAttributes: attributes.map(item => ({
        id: item.sustainabilityAttribute.id,
        name: item.sustainabilityAttribute.name,
        description: item.sustainabilityAttribute.description,
      }))
    };
  }

  async findReviews(productId: number, pagination: PaginationDto) {
    await this.findPublicProduct(productId);

    const { page, size, sortBy, sortDirection } = pagination;

    const allowedSortFields = ['id', 'rating', 'createdAt'];

    if (!allowedSortFields.includes(sortBy)) {
      throw new BadRequestException('Campo de ordenamiento inválido.');
    }

    const queryBuilder = this.reviewsRepository
      .createQueryBuilder('review')
      .innerJoin('review.customer', 'customer')
      .innerJoin('customer.user', 'user')
      .where('review.productId = :productId', { productId });

    const totalElements = await queryBuilder.getCount();

    queryBuilder
      .select('review.id', 'id')
      .addSelect('user.firstName', 'author')
      .addSelect('review.comment', 'comment')
      .addSelect('review.rating', 'rating')
      .addSelect('review.createdAt', 'createdAt')
      .orderBy(`review.${sortBy}`, sortDirection);

    if (sortBy !== 'id') {
      queryBuilder.addOrderBy('review.id', 'ASC');
    }

    const content: ProductReviewDto[] = await queryBuilder
      .offset(page * size)
      .limit(size)
      .getRawMany();

    return {
      content,
      page,
      size,
      totalElements,
      totalPages: Math.ceil(totalElements / size),
      sortBy,
      sortDirection,
    };
  }

  async findRelatedProducts(productId: number, quantity: number): Promise<ProductSummaryDto[]> {
    this.validateQuantity(quantity);

    const product = await this.findPublicProduct(productId);

    const relatedProducts = await this.createPublicProductsQuery()
      .andWhere('product.categoryId = :categoryId', {
        categoryId: product.categoryId
      })
      .andWhere('product.id <> :productId', { productId })
      .orderBy('product.id', 'ASC')
      .limit(quantity)
      .getMany();

    return this.toSummaryDtos(relatedProducts, new Date());
  }

  async findProductsByProducer(producerId: number, pagination: PaginationDto) {

    const queryBuilder = this.createPublicProductsQuery()
      .andWhere('product.producerId = :producerId', { producerId });

    return this.paginateProducts(queryBuilder, pagination, new Date());
  }

  async findFavoriteProduct(productId: number): Promise<FavoriteProductDto> {

    const product = await this.findPublicProduct(productId);
    const [summary] = await this.toSummaryDtos([product], new Date());

    return summary;
  }

  async findFavoriteProducts(customerId: number): Promise<FavoriteProductDto[]> {

    const products = await this.createPublicProductsQuery()
      .innerJoin(FavoriteEntity, 'favorite', 'favorite.productId = product.id')
      .andWhere('favorite.customerId = :customerId', { customerId })
      .orderBy('favorite.createdAt', 'DESC')
      .addOrderBy('favorite.productId', 'ASC')
      .getMany();

    return this.toSummaryDtos(products, new Date());
  }

  private createPublicProductsQuery(): SelectQueryBuilder<ProductEntity> {

    return this.productsRepository.createQueryBuilder('product')
      .innerJoinAndSelect('product.producer', 'producer')
      .innerJoin('producer.user', 'user')
      .where('product.isActive = :productActive', { productActive: true })
      .andWhere('user.isActive = :userActive', { userActive: true })
      .andWhere('user.role = :role', { role: UserRole.PRODUCER });
  }


  private async paginateProducts(queryBuilder: SelectQueryBuilder<ProductEntity>, pagination: PaginationDto, now: Date) {
    const { page, size, sortBy, sortDirection } = pagination;

    const allowedSortFields = [
      'id', 'name', 'price', 'finalPrice',
      'stock', 'co2Avoided', 'createdAt',
    ];

    if (!allowedSortFields.includes(sortBy)) {
      throw new BadRequestException('Campo de ordenamiento inválido.');
    }

    const totalElements = await queryBuilder.getCount();

    if (sortBy === 'finalPrice') {

      queryBuilder
        .addSelect(
          `CASE
                    WHEN product.offer_price IS NOT NULL
                    AND product.offer_start_at <= :now
                    AND product.offer_end_at > :now
                    THEN product.offer_price
                    ELSE product.price
                END`,
          'effective_price',
        )
        .setParameter('now', now)
        .orderBy('effective_price', sortDirection);

    } else {
      queryBuilder.orderBy(`product.${sortBy}`, sortDirection);
    }

    if (sortBy !== 'id') {
      queryBuilder.addOrderBy('product.id', 'ASC');
    }

    const products = await queryBuilder
      .offset(page * size)
      .limit(size)
      .getMany();

    const content = await this.toSummaryDtos(products, now);

    return {
      content,
      page,
      size,
      totalElements,
      totalPages: Math.ceil(totalElements / size),
      sortBy,
      sortDirection,
    };
  }

  async findPublicProduct(productId: number): Promise<ProductEntity> {

    if (!Number.isInteger(productId) || productId <= 0) {
      throw new BadRequestException(
        'El identificador debe ser un número entero positivo.',
      );
    }
    const product = await this.createPublicProductsQuery()
      .innerJoinAndSelect('product.category', 'category')
      .andWhere('product.id = :productId', { productId })
      .getOne();

    if (!product) {
      throw new ProductNotFoundError();
    }

    return product;
  }

  getActiveOfferPrice(product: ProductEntity, now: Date): number | null {

    if (
      product.offerPrice !== null &&
      product.offerStartAt !== null &&
      product.offerEndAt !== null &&
      product.offerStartAt <= now &&
      now < product.offerEndAt
    ) {
      return product.offerPrice;
    }

    return null;
  }

  calculateGreenPoints(co2Avoided: string): number {
    const value = Math.round(Number(co2Avoided) * 10000);
    return Math.floor(value / 100);
  }

  private validateQuantity(quantity: number): void {

    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100) {
      throw new BadRequestException(
        'La cantidad debe ser un número entero entre 1 y 100.',
      );
    }
  }

  private async toSummaryDtos(products: ProductEntity[], now: Date): Promise<ProductSummaryDto[]> {
    if (products.length === 0) {
      return [];
    }

    const productIds = products.map(product => product.id);

    const reviews = await this.reviewsRepository
      .createQueryBuilder('review')
      .select('review.productId', 'productId')
      .addSelect('AVG(review.rating)', 'rating')
      .addSelect('COUNT(review.id)', 'reviewCount')
      .where('review.productId IN (:...productIds)', { productIds })
      .groupBy('review.productId')
      .getRawMany<{
        productId: number;
        rating: string;
        reviewCount: string;
      }>();

    const images = await this.productImagesRepository.find({
      where: {
        productId: In(productIds),
        isPrimary: true,
      },
    });

    const reviewMap = new Map(
      reviews.map(review => [Number(review.productId), review]),
    );

    const imageMap = new Map(
      images.map(image => [image.productId, image.fileId]),
    );

    return products.map(product => {

      const review = reviewMap.get(product.id);

      const rating = review
        ? Number(Number(review.rating).toFixed(2))
        : null;

      const reviewCount = review ? Number(review.reviewCount) : 0;

      return ProductMapper.toSummaryDto(
        product,
        this.getActiveOfferPrice(product, now),
        this.calculateGreenPoints(product.co2Avoided),
        rating,
        reviewCount,
        imageMap.get(product.id) ?? null,
      );
    });
  }

  async findSpecializedDetails(product: ProductEntity, manager?: EntityManager): Promise<Record<string, string | number | null> | null> {
    const productId = product.id;
    switch (product.category.name) {

      case 'Alimentos': {

        const repository = manager
          ? manager.getRepository(FoodDetailEntity)
          : this.foodDetailsRepository;

        const detail = await repository.findOne({
          where: { productId },
        });

        return detail ? {
          weightG: this.toNumber(detail.weightG),
          ingredients: detail.ingredients,
          allergens: detail.allergens,
          expirationDate: detail.expirationDate,
        } : null;
      }

      case 'Cuidado personal': {

        const repository = manager
          ? manager.getRepository(PersonalCareDetailEntity)
          : this.personalCareDetailsRepository;

        const detail = await repository.findOne({
          where: { productId },
        });

        return detail ? {
          volumeMl: this.toNumber(detail.volumeMl),
          ingredients: detail.ingredients,
          skinType: detail.skinType,
        } : null;
      }

      case 'Huerto y jardín': {

        const repository = manager
          ? manager.getRepository(GardenDetailEntity)
          : this.gardenDetailsRepository;

        const detail = await repository.findOne({
          where: { productId },
        });

        return detail ? {
          material: detail.material,
          heightCm: this.toNumber(detail.heightCm),
          widthCm: this.toNumber(detail.widthCm),
          depthCm: this.toNumber(detail.depthCm),
          weightG: this.toNumber(detail.weightG),
          usageType: detail.usageType,
        } : null;
      }

      case 'Limpieza del hogar': {

        const repository = manager
          ? manager.getRepository(HomeCleaningDetailEntity)
          : this.homeCleaningDetailsRepository;

        const detail = await repository.findOne({
          where: { productId },
        });

        return detail ? {
          volumeMl: this.toNumber(detail.volumeMl),
          composition: detail.composition,
          applicationSurface: detail.applicationSurface,
        } : null;
      }

      case 'Aromas y bienestar': {

        const repository = manager
          ? manager.getRepository(WellnessDetailEntity)
          : this.wellnessDetailsRepository;

        const detail = await repository.findOne({
          where: { productId },
        });

        return detail ? {
          fragrance: detail.fragrance,
          volumeMl: this.toNumber(detail.volumeMl),
          durationHours: this.toNumber(detail.durationHours),
          format: detail.format,
        } : null;
      }

      case 'Ropa y accesorios': {

        const repository = manager
          ? manager.getRepository(ClothingDetailEntity)
          : this.clothingDetailsRepository;

        const detail = await repository.findOne({
          where: { productId },
        });

        return detail ? {
          size: detail.size,
          color: detail.color,
          material: detail.material,
        } : null;
      }

      case 'Mascotas': {

        const repository = manager
          ? manager.getRepository(PetDetailEntity)
          : this.petDetailsRepository;

        const detail = await repository.findOne({
          where: { productId },
        });

        return detail ? {
          petType: detail.petType,
          size: detail.size,
          weightG: this.toNumber(detail.weightG),
          material: detail.material,
        } : null;
      }

      case 'Decoración y artesanía': {

        const repository = manager
          ? manager.getRepository(CraftDetailEntity)
          : this.craftDetailsRepository;

        const detail = await repository.findOne({
          where: { productId },
        });

        return detail ? {
          material: detail.material,
          heightCm: this.toNumber(detail.heightCm),
          widthCm: this.toNumber(detail.widthCm),
          depthCm: this.toNumber(detail.depthCm),
          color: detail.color,
          weightG: this.toNumber(detail.weightG),
        } : null;
      }

      default:
        return null;
    }
  }
  private toNumber(value: string | null): number | null {
    return value === null ? null : Number(value);
  }
}