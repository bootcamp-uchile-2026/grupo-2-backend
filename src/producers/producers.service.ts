import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, DataSource } from 'typeorm';
import { ProducerEntity } from '../models/producer.entity';
import { UserEntity, UserRole } from '../models/user.entity';
import { PaginationDto } from '../dto/pagination.dto';
import { ProducerSummaryDto } from '../dto/producer-summary.dto';
import { ProducerDetailDto } from '../dto/producer-detail.dto';
import { ProducerStatisticsDto } from '../dto/producer-statistics.dto';
import { StatisticsQueryDto } from '../dto/statistics-query.dto';
import { ProducerNotFoundError } from '../common/errors/producer-not-found.error';
import { ProducerMapper } from './producer.mapper';
import { ProductsService } from '../products/products.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { ManagedProductDto } from '../dto/managed-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import * as argon2 from 'argon2';
import { CreateProducerDto } from '../dto/create-producer.dto';
import { ProducerProfileDto } from '../dto/producer-profile.dto';
import { DuplicateEmailError } from '../common/errors/duplicate-email.error';
import { UpdateUserStatusDto } from '../dto/update-user-status.dto';
import { UpdateProducerDto } from '../dto/update-producer.dto';
import { ProductImageDto } from '../dto/product-image.dto';
import { FilesService } from '../files/files.service';
import { FileEntity } from '../models/file.entity';

@Injectable()
export class ProducersService {

    constructor(
        @InjectRepository(ProducerEntity)
        private readonly producersRepository: Repository<ProducerEntity>,
        private readonly productsService: ProductsService,
        private readonly dataSource: DataSource,
        private readonly filesService: FilesService) { }

    async create(dto: CreateProducerDto): Promise<ProducerProfileDto> {
        const email = dto.email.trim().toLowerCase();
        const firstName = dto.firstName.trim();
        const businessName = dto.businessName.trim();

        if (!firstName || !businessName) {
            throw new BadRequestException('El nombre y el nombre comercial son obligatorios.');
        }

        if (dto.privacyAccepted !== true) {
            throw new BadRequestException('Debe aceptar la política de privacidad.');
        }

        await this.validateEmail(email);

        const passwordHash = await argon2.hash(dto.password, { type: argon2.argon2id });

        return this.dataSource.transaction(async manager => {
            const user = manager.create(UserEntity, {
                email,
                passwordHash,
                firstName,
                lastName: dto.lastName?.trim() || null,
                phone: dto.phone?.trim() || null,
                profileFileId: null,
                role: UserRole.PRODUCER,
                isActive: true,
                privacyAcceptedAt: new Date(),
            });

            const savedUser = await manager.save(user);

            const producer = manager.create(ProducerEntity, {
                userId: savedUser.id,
                businessName,
                description: dto.description?.trim() || null,
                location: dto.location?.trim() || null,
                websiteUrl: dto.websiteUrl?.trim() || null,
                logoFileId: null,
                bannerFileId: null,
            });

            const savedProducer = await manager.save(producer);

            savedProducer.user = savedUser;

            return ProducerMapper.toProfileDto(savedProducer);
        });
    }

    async findAll(pagination: PaginationDto) {
        const { page, size, sortBy, sortDirection } = pagination;
        const allowedSortFields = [
            'id',
            'businessName',
            'location',
            'createdAt',
        ];

        if (!allowedSortFields.includes(sortBy)) {
            throw new BadRequestException(
                'Campo de ordenamiento inválido.',
            );
        }

        const where = {
            user: {
                isActive: true,
                role: UserRole.PRODUCER,
            },
        };

        const producers = await this.producersRepository.find({
            where,
            skip: page * size,
            take: size,
            order: {
                [sortBy]: sortDirection,
                id: sortBy === 'id' ? sortDirection : 'ASC',
            },
        });

        const totalElements =
            await this.producersRepository.count({ where });

        const content: ProducerSummaryDto[] = producers.map(
            producer => ProducerMapper.toSummaryDto(producer),
        );

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

    async findManagedProducers(pagination: PaginationDto) {
        const { page, size, sortBy, sortDirection } = pagination;
        const allowedSortFields = ['id', 'businessName', 'location', 'createdAt', 'firstName', 'lastName', 'email', 'isActive'];

        if (!allowedSortFields.includes(sortBy)) {
            throw new BadRequestException('Campo de ordenamiento inválido.');
        }

        const userFields = ['firstName', 'lastName', 'email', 'isActive'];
        const sortField = userFields.includes(sortBy) ? `user.${sortBy}` : `producer.${sortBy}`;

        const query = this.producersRepository.createQueryBuilder('producer')
            .innerJoinAndSelect('producer.user', 'user')
            .where('user.role = :role', { role: UserRole.PRODUCER });

        const totalElements = await query.getCount();

        query.orderBy(sortField, sortDirection);

        if (sortBy !== 'id') {
            query.addOrderBy('producer.id', 'ASC');
        }

        const producers = await query.skip(page * size).take(size).getMany();

        return {
            content: producers.map(producer => ProducerMapper.toProfileDto(producer)),
            page,
            size,
            totalElements,
            totalPages: Math.ceil(totalElements / size),
            sortBy,
            sortDirection,
        };
    }

    async findOne(producerId: number): Promise<ProducerDetailDto> {
        const producer = await this.findProducer(producerId);
        return ProducerMapper.toDetailDto(producer);
    }

    async updateProfile(producerId: number, dto: UpdateProducerDto, userId: number): Promise<ProducerProfileDto> {

        if (!Object.values(dto).some(value => value !== undefined)) {
            throw new BadRequestException('Debe proporcionar al menos un atributo para actualizar.');
        }

        await this.dataSource.transaction(async manager => {
            await this.validateOwnership(producerId, userId, manager);

            const producer = await this.findProducer(producerId, manager);
            const user = producer.user;

            if (dto.email !== undefined) {
                const email = dto.email.trim().toLowerCase();
                await this.validateEmail(email, user.id);
                user.email = email;
            }

            if (dto.firstName !== undefined) {
                const firstName = dto.firstName.trim();

                if (!firstName) {
                    throw new BadRequestException('El nombre es obligatorio.');
                }

                user.firstName = firstName;
            }

            if (dto.lastName !== undefined) {
                user.lastName = dto.lastName?.trim() || null;
            }

            if (dto.phone !== undefined) {
                user.phone = dto.phone?.trim() || null;
            }

            if (dto.password !== undefined) {
                user.passwordHash = await argon2.hash(dto.password, { type: argon2.argon2id });
            }

            if (dto.businessName !== undefined) {
                const businessName = dto.businessName.trim();

                if (!businessName) {
                    throw new BadRequestException('El nombre comercial es obligatorio.');
                }

                producer.businessName = businessName;
            }

            if (dto.description !== undefined) {
                producer.description = dto.description?.trim() || null;
            }

            if (dto.location !== undefined) {
                producer.location = dto.location?.trim() || null;
            }

            if (dto.websiteUrl !== undefined) {
                producer.websiteUrl = dto.websiteUrl?.trim() || null;
            }

            user.updatedAt = new Date();
            producer.updatedAt = new Date();

            await manager.update(UserEntity, user.id, {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                passwordHash: user.passwordHash,
                updatedAt: user.updatedAt,
            });

            await manager.update(ProducerEntity, producer.id, {
                businessName: producer.businessName,
                description: producer.description,
                location: producer.location,
                websiteUrl: producer.websiteUrl,
                updatedAt: producer.updatedAt,
            });
        });

        return this.findProfile(producerId, userId);
    }

    async uploadImage(producerId: number, archivo: Express.Multer.File, userId: number, domain: 'perfiles' | 'logos' | 'banners'): Promise<ProducerProfileDto> {

        let storageKey: string | undefined;

        try {
            const previousStorageKey = await this.dataSource.transaction(async manager => {

                await this.validateOwnership(producerId, userId, manager);

                const producer = await manager.findOne(ProducerEntity, {
                    where: { id: producerId, userId },
                    lock: { mode: 'pessimistic_write' },
                });

                const user = await manager.findOne(UserEntity, {
                    where: { id: userId, isActive: true },
                    lock: { mode: 'pessimistic_write' },
                });

                if (!producer || !user) {
                    throw new ForbiddenException('Usuario no autorizado.');
                }

                const previousFileId = domain === 'perfiles' ? user.profileFileId : domain === 'logos' ? producer.logoFileId : producer.bannerFileId;

                const file = await this.filesService.saveImage(archivo, domain, manager);

                storageKey = file.storageKey;

                if (domain === 'perfiles') {

                    await manager.update(UserEntity, user.id, {
                        profileFileId: file.id,
                        updatedAt: new Date(),
                    });

                } else if (domain === 'logos') {

                    await manager.update(ProducerEntity, producer.id, {
                        logoFileId: file.id,
                        updatedAt: new Date(),
                    });

                } else {

                    await manager.update(ProducerEntity, producer.id, {
                        bannerFileId: file.id,
                        updatedAt: new Date(),
                    });
                }

                if (previousFileId) {

                    const previousFile = await manager.findOne(FileEntity, {
                        where: { id: previousFileId },
                    });

                    if (previousFile) {
                        await manager.delete(FileEntity, previousFile.id);

                        return previousFile.storageKey;
                    }
                }

                return undefined;
            });

            if (previousStorageKey) {
                await this.filesService.deletePhysicalImage(previousStorageKey);
            }

        } catch (error) {
            if (storageKey) {
                await this.filesService.deletePhysicalImage(storageKey);
            }

            throw error;
        }

        const producer = await this.findProducer(producerId);

        return ProducerMapper.toProfileDto(producer);
    }

    async findProductsByProducer(producerId: number, pagination: PaginationDto) {

        await this.findProducer(producerId);

        return this.productsService.findProductsByProducer(producerId, pagination);
    }

    async findProfile(producerId: number, userId: number): Promise<ProducerProfileDto> {
        await this.validateOwnership(producerId, userId);
        return this.findManagedProducer(producerId);
    }

    async getStatistics(producerId: number, query: StatisticsQueryDto, userId: number): Promise<ProducerStatisticsDto> {
        await this.validateOwnership(producerId, userId);

        const products = await this.dataSource.query(
            `
        SELECT
            COUNT(*) AS "totalProducts",

            COUNT(*) FILTER (
                WHERE is_active = true
            ) AS "activeProducts",

            COUNT(*) FILTER (
                WHERE is_active = false
            ) AS "inactiveProducts",

            COUNT(*) FILTER (
                WHERE is_active = true
                AND stock = 0
            ) AS "outOfStockProducts"

        FROM products
        WHERE producer_id = $1
        `,
            [producerId],
        );

        const preparation = await this.dataSource.query(
            `
        SELECT
            COUNT(*) AS "pendingPreparationItems"
        FROM order_items oi
        JOIN orders o ON o.id = oi.order_id
        JOIN products p ON p.id = oi.product_id
        WHERE p.producer_id = $1
          AND oi.is_prepared = false
          AND o.status IN ('CONFIRMED', 'PREPARING')
        `,
            [producerId],
        );

        const sales = await this.dataSource.query(
            `
        SELECT
            COALESCE(
                SUM(
                    oi.quantity - COALESCE(returned.quantity, 0)
                ),
                0
            ) AS "netUnitsSold",

            COALESCE(
                SUM(
                    (oi.quantity - COALESCE(returned.quantity, 0))
                    * oi.unit_price
                ),
                0
            ) AS "netSales",

            COALESCE(
                SUM(
                    (oi.quantity - COALESCE(returned.quantity, 0))
                    * oi.unit_co2_avoided
                ),
                0
            ) AS "co2Avoided"

        FROM order_items oi
        JOIN orders o ON o.id = oi.order_id
        JOIN products p ON p.id = oi.product_id

        LEFT JOIN (
            SELECT
                ri.order_item_id,
                SUM(ri.quantity) AS quantity
            FROM return_items ri
            JOIN returns r ON r.id = ri.return_id
            WHERE r.status = 'COMPLETED'
            GROUP BY ri.order_item_id
        ) returned ON returned.order_item_id = oi.id

        WHERE p.producer_id = $1
          AND o.status = 'DELIVERED'
          AND (
              $2::text IS NULL
              OR o.delivered_at >= (
                  DATE_TRUNC(
                      $2::text,
                      NOW() AT TIME ZONE 'America/Santiago'
                  ) AT TIME ZONE 'America/Santiago'
              )
          )
        `,
            [producerId, query.period ?? null],
        );

        return {
            producerId,

            totalProducts:
                Number(products[0].totalProducts),

            activeProducts:
                Number(products[0].activeProducts),

            inactiveProducts:
                Number(products[0].inactiveProducts),

            outOfStockProducts:
                Number(products[0].outOfStockProducts),

            netUnitsSold:
                Number(sales[0].netUnitsSold),

            netSales:
                Number(sales[0].netSales),

            pendingPreparationItems:
                Number(preparation[0].pendingPreparationItems),

            co2Avoided:
                Number(sales[0].co2Avoided),
        };
    }

    async createProduct(producerId: number, dto: CreateProductDto, userId: number): Promise<ManagedProductDto> {
        await this.validateOwnership(producerId, userId);
        return this.productsService.create(producerId, dto);
    }

    async findManagedProduct(producerId: number, productId: number, userId: number): Promise<ManagedProductDto> {
        await this.validateOwnership(producerId, userId);
        return this.productsService.findManagedProduct(producerId, productId);
    }

    async validateOwnership(producerId: number, userId: number, manager?: EntityManager): Promise<void> {

        const producer = await this.findProducer(producerId, manager);

        if (producer.userId !== userId) {
            throw new ForbiddenException(
                'No tienes permisos para acceder a este perfil.',
            );
        }
    }

    async updateProduct(producerId: number, productId: number, dto: UpdateProductDto, userId: number): Promise<ManagedProductDto> {

        await this.validateOwnership(producerId, userId);

        return this.productsService.update(producerId, productId, dto);
    }

    async addProductImage(producerId: number, productId: number, archivo: Express.Multer.File, userId: number): Promise<ProductImageDto> {

        await this.validateOwnership(producerId, userId);

        return this.productsService.addImage(producerId, productId, archivo);
    }

    async setPrimaryProductImage(producerId: number, productId: number, imageId: number, userId: number): Promise<ProductImageDto> {

        await this.validateOwnership(producerId, userId);

        return this.productsService.setPrimaryImage(producerId, productId, imageId);
    }

    async deleteProductImage(producerId: number, productId: number, imageId: number, userId: number): Promise<void> {

        await this.validateOwnership(producerId, userId);

        return this.productsService.deleteImage(producerId, productId, imageId);
    }

    async findManagedProducts(producerId: number, pagination: PaginationDto, userId: number) {

        await this.validateOwnership(producerId, userId);

        return this.productsService.findManagedProducts(producerId, pagination);
    }

    async findManagedProducer(producerId: number): Promise<ProducerProfileDto> {
        const producer = await this.findProducer(producerId, undefined, false);
        return ProducerMapper.toProfileDto(producer);
    }

    async updateStatus(producerId: number, dto: UpdateUserStatusDto): Promise<ProducerProfileDto> {
        const producer = await this.findProducer(producerId, undefined, false);

        await this.dataSource.getRepository(UserEntity).update(producer.userId, {
            isActive: dto.isActive,
            updatedAt: new Date(),
        });

        return this.findManagedProducer(producerId);
    }

    private async validateEmail(email: string, userId?: number): Promise<void> {
        const existingUser = await this.dataSource.getRepository(UserEntity)
            .createQueryBuilder('user')
            .where('LOWER(user.email) = :email', { email })
            .getOne();

        if (existingUser && existingUser.id !== userId) {
            throw new DuplicateEmailError();
        }
    }

    private async findProducer(producerId: number, manager?: EntityManager, requireActive: boolean = true): Promise<ProducerEntity> {
        if (!Number.isInteger(producerId) || producerId <= 0) {
            throw new BadRequestException('El identificador debe ser un número entero positivo.');
        }

        const repository = manager ? manager.getRepository(ProducerEntity) : this.producersRepository;

        const producer = await repository.findOne({
            where: {
                id: producerId,
                user: {
                    role: UserRole.PRODUCER,
                    ...(requireActive ? { isActive: true } : {}),
                },
            },
            relations: { user: true },
        });

        if (!producer) {
            throw new ProducerNotFoundError();
        }

        return producer;
    }
}