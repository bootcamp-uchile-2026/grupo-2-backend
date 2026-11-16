import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder, In, EntityManager, DataSource } from 'typeorm';
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
import { CategoryEntity } from '../models/category.entity';
import { SustainabilityAttributeEntity } from '../models/sustainability-attribute.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { ManagedProductDto } from '../dto/managed-product.dto';
import { ProductSpecializedDetailsDto } from '../dto/product-specialized-details.dto';
import { CategoryNotFoundError } from '../common/errors/category-not-found.error';
import { InvalidProductError } from '../common/errors/invalid-product.error';
import { UpdateProductDto } from '../dto/update-product.dto';

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
    private readonly craftDetailsRepository: Repository<CraftDetailEntity>,

    private readonly dataSource: DataSource,
  ) { }

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
    return this.toDetailDto(product);
  }

  private async toDetailDto(product: ProductEntity): Promise<ProductDetailDto> {
    const [summary] = await this.toSummaryDtos([product], new Date());

    const images = await this.productImagesRepository.find({
      where: { productId: product.id },
      order: { displayOrder: 'ASC' },
    });

    const details = await this.findSpecializedDetails(product);

    return {
      ...summary,
      description: product.description,
      categoryName: product.category.name,
      imageFileIds: images.map(image => image.fileId),
      details,
    };
  }

  private async toManagedProductDto(product: ProductEntity): Promise<ManagedProductDto> {
    const detail = await this.toDetailDto(product);

    const attributes = await this.sustainabilityRepository.find({
      where: { productId: product.id },
      order: { sustainabilityAttributeId: 'ASC' },
    });

    return {
      ...detail,
      isActive: product.isActive,
      configuredOfferPrice: product.offerPrice,
      offerStartAt: product.offerStartAt,
      offerEndAt: product.offerEndAt,
      sustainabilityAttributeIds: attributes.map(item => item.sustainabilityAttributeId),
    };
  }

  async findManagedProducts(producerId: number, pagination: PaginationDto) {

    const queryBuilder = this.productsRepository
      .createQueryBuilder('product')
      .innerJoinAndSelect('product.producer', 'producer')
      .where('product.producerId = :producerId', { producerId });

    return this.paginateProducts(queryBuilder, pagination, new Date(), true);
  }

  async update(producerId: number, productId: number, dto: UpdateProductDto): Promise<ManagedProductDto> {

    if (!Number.isInteger(productId) || productId <= 0) {
      throw new BadRequestException('El identificador debe ser un número entero positivo.');
    }

    if (!Object.values(dto).some(value => value !== undefined)) {
      throw new BadRequestException('Debe proporcionar al menos un atributo para actualizar.');
    }

    await this.dataSource.transaction(async manager => {

      const product = await manager.findOne(ProductEntity, {
        where: { id: productId, producerId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!product) {
        throw new ProductNotFoundError();
      }

      if (dto.name !== undefined) {
        const name = dto.name.trim();

        if (!name) {
          throw new BadRequestException('El nombre del producto es obligatorio.');
        }

        product.name = name;
      }

      if (dto.description !== undefined) {
        const description = dto.description.trim();

        if (!description) {
          throw new BadRequestException('La descripción del producto es obligatoria.');
        }

        product.description = description;
      }

      if (dto.price !== undefined) {
        product.price = dto.price;
      }

      if (dto.stock !== undefined) {
        product.stock = dto.stock;
      }

      if (dto.co2Avoided !== undefined) {
        product.co2Avoided = dto.co2Avoided.toFixed(4);
      }

      if (dto.isActive !== undefined) {
        product.isActive = dto.isActive;
      }

      if (dto.offerPrice !== undefined) {
        product.offerPrice = dto.offerPrice;
      }

      if (dto.offerStartAt !== undefined) {
        product.offerStartAt = dto.offerStartAt === null ? null : new Date(dto.offerStartAt);
      }

      if (dto.offerEndAt !== undefined) {
        product.offerEndAt = dto.offerEndAt === null ? null : new Date(dto.offerEndAt);
      }

      this.validateOffer(product);

      product.updatedAt = new Date();

      await manager.save(ProductEntity, product);

      if (dto.details !== undefined) {

        const category = await manager.findOne(CategoryEntity, {
          where: { id: product.categoryId },
        });

        if (!category) {
          throw new CategoryNotFoundError();
        }

        await this.saveSpecializedDetails(product.id, category.name, dto.details, manager);
      }

      if (dto.sustainabilityAttributeIds !== undefined) {
        await this.saveSustainabilityAttributes(product.id, dto.sustainabilityAttributeIds, manager);
      }
    });

    return this.findManagedProduct(producerId, productId);
  }

  private validateOffer(product: ProductEntity): void {

    const { price, offerPrice, offerStartAt, offerEndAt } = product;

    if (offerPrice === null && offerStartAt === null && offerEndAt === null) {
      return;
    }

    if (offerPrice === null || offerStartAt === null || offerEndAt === null) {
      throw new InvalidProductError('La oferta debe incluir precio, fecha de inicio y fecha de término.');
    }

    if (offerPrice <= 0 || offerPrice >= price) {
      throw new InvalidProductError('El precio de oferta debe ser mayor que cero y menor que el precio normal.');
    }

    if (offerEndAt <= offerStartAt) {
      throw new InvalidProductError('La fecha de término de la oferta debe ser posterior a la fecha de inicio.');
    }
  }

  private validateSpecializedDetails(categoryName: string, details: ProductSpecializedDetailsDto): void {

    const allowedFields: Record<string, string[]> = {
      'Alimentos': ['weightG', 'ingredients', 'allergens', 'expirationDate'],
      'Cuidado personal': ['volumeMl', 'ingredients', 'skinType'],
      'Huerto y jardín': ['material', 'heightCm', 'widthCm', 'depthCm', 'weightG', 'usageType'],
      'Limpieza del hogar': ['volumeMl', 'composition', 'applicationSurface'],
      'Aromas y bienestar': ['fragrance', 'volumeMl', 'durationHours', 'format'],
      'Ropa y accesorios': ['size', 'color', 'material'],
      'Mascotas': ['petType', 'size', 'weightG', 'material'],
      'Decoración y artesanía': ['material', 'heightCm', 'widthCm', 'depthCm', 'color', 'weightG'],
    };

    const categoryFields = allowedFields[categoryName];

    if (!categoryFields) {
      throw new InvalidProductError('La categoría no admite atributos especializados.');
    }

    for (const [field, value] of Object.entries(details)) {
      if (value !== undefined && !categoryFields.includes(field)) {
        throw new InvalidProductError(`El atributo ${field} no corresponde a la categoría ${categoryName}.`);
      }
    }
  }

  private async saveSpecializedDetails(productId: number, categoryName: string, details: ProductSpecializedDetailsDto, manager: EntityManager): Promise<void> {
    this.validateSpecializedDetails(categoryName, details);

    switch (categoryName) {

      case 'Alimentos':
        await manager.save(FoodDetailEntity, {
          productId,
          weightG: details.weightG == null ? details.weightG : String(details.weightG), ingredients: details.ingredients,
          allergens: details.allergens,
          expirationDate: details.expirationDate,
        });
        break;

      case 'Cuidado personal':
        await manager.save(PersonalCareDetailEntity, {
          productId,
          volumeMl: details.volumeMl == null ? details.volumeMl : String(details.volumeMl),
          ingredients: details.ingredients,
          skinType: details.skinType,
        });
        break;

      case 'Huerto y jardín':
        await manager.save(GardenDetailEntity, {
          productId,
          material: details.material,
          heightCm: details.heightCm == null ? details.heightCm : String(details.heightCm),
          widthCm: details.widthCm == null ? details.widthCm : String(details.widthCm),
          depthCm: details.depthCm == null ? details.depthCm : String(details.depthCm),
          weightG: details.weightG == null ? details.weightG : String(details.weightG),
          usageType: details.usageType,
        });
        break;

      case 'Limpieza del hogar':
        await manager.save(HomeCleaningDetailEntity, {
          productId,
          volumeMl: details.volumeMl == null ? details.volumeMl : String(details.volumeMl),
          composition: details.composition,
          applicationSurface: details.applicationSurface,
        });
        break;

      case 'Aromas y bienestar':
        await manager.save(WellnessDetailEntity, {
          productId,
          fragrance: details.fragrance,
          volumeMl: details.volumeMl == null ? details.volumeMl : String(details.volumeMl),
          durationHours: details.durationHours == null ? details.durationHours : String(details.durationHours), format: details.format,
        });
        break;

      case 'Ropa y accesorios':
        await manager.save(ClothingDetailEntity, {
          productId,
          size: details.size,
          color: details.color,
          material: details.material,
        });
        break;

      case 'Mascotas':
        await manager.save(PetDetailEntity, {
          productId,
          petType: details.petType,
          size: details.size,
          weightG: details.weightG == null ? details.weightG : String(details.weightG),
          material: details.material,
        });
        break;

      case 'Decoración y artesanía':
        await manager.save(CraftDetailEntity, {
          productId,
          material: details.material,
          heightCm: details.heightCm == null ? details.heightCm : String(details.heightCm),
          widthCm: details.widthCm == null ? details.widthCm : String(details.widthCm),
          depthCm: details.depthCm == null ? details.depthCm : String(details.depthCm),
          color: details.color,
          weightG: details.weightG == null ? details.weightG : String(details.weightG),
        });
        break;
    }
  }

  private async validateSustainabilityAttributes(attributeIds: number[], manager: EntityManager): Promise<void> {
    if (attributeIds.length === 0) {
      return;
    }

    const attributes = await manager.find(SustainabilityAttributeEntity, {
      where: { id: In(attributeIds) },
    });

    if (attributes.length !== attributeIds.length) {
      throw new InvalidProductError('Uno o más atributos de sustentabilidad no existen.');
    }
  }

  private async saveSustainabilityAttributes(productId: number, attributeIds: number[], manager: EntityManager): Promise<void> {
    await this.validateSustainabilityAttributes(attributeIds, manager);

    await manager.delete(ProductSustainabilityAttributeEntity, { productId });

    for (const attributeId of attributeIds) {
      await manager.save(ProductSustainabilityAttributeEntity, {
        productId,
        sustainabilityAttributeId: attributeId,
      });
    }
  }

  async create(producerId: number, dto: CreateProductDto): Promise<ManagedProductDto> {
    const name = dto.name.trim();
    const description = dto.description.trim();

    if (!name || !description) {
      throw new BadRequestException('El nombre y la descripción del producto son obligatorios.');
    }

    const productId = await this.dataSource.transaction(async manager => {

      const category = await manager.findOne(CategoryEntity, {
        where: { id: dto.categoryId },
      });

      if (!category) {
        throw new CategoryNotFoundError();
      }

      const details = dto.details ?? {};

      this.validateSpecializedDetails(category.name, details);

      const now = new Date();

      const product = await manager.save(ProductEntity, {
        producerId,
        categoryId: category.id,
        name,
        description,
        price: dto.price,
        stock: dto.stock,
        co2Avoided: dto.co2Avoided.toFixed(4),
        isActive: dto.isActive ?? true,
        offerPrice: null,
        offerStartAt: null,
        offerEndAt: null,
        createdAt: now,
        updatedAt: now,
      });

      await this.saveSpecializedDetails(product.id, category.name, details, manager);

      await this.saveSustainabilityAttributes(product.id, dto.sustainabilityAttributeIds ?? [], manager);

      return product.id;
    });

    return this.findManagedProduct(producerId, productId);
  }

  async findManagedProduct(producerId: number, productId: number): Promise<ManagedProductDto> {
    if (!Number.isInteger(productId) || productId <= 0) {
      throw new BadRequestException('El identificador debe ser un número entero positivo.');
    }

    const product = await this.productsRepository.findOne({
      where: { id: productId, producerId },
      relations: {
        producer: true,
        category: true,
      },
    });

    if (!product) {
      throw new ProductNotFoundError();
    }

    return this.toManagedProductDto(product);
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

  private async paginateProducts(queryBuilder: SelectQueryBuilder<ProductEntity>, pagination: PaginationDto, now: Date, managed: boolean = false) {

    const { page, size, sortBy, sortDirection } = pagination;

    const allowedSortFields = [
      'id', 'name', 'price', 'finalPrice',
      'stock', 'co2Avoided', 'createdAt',
    ];

    if (managed) {
      allowedSortFields.push('isActive');
    }

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

    const summaries = await this.toSummaryDtos(products, now);

    const content = managed
      ? summaries.map((summary, index) => ({
        ...summary,
        isActive: products[index].isActive,
      }))
      : summaries;

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