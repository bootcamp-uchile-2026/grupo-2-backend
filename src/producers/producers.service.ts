import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, DataSource } from 'typeorm';
import { ProducerEntity } from '../models/producer.entity';
import { UserRole } from '../models/user.entity';
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

@Injectable()
export class ProducersService {

    constructor(
        @InjectRepository(ProducerEntity)
        private readonly producersRepository: Repository<ProducerEntity>,

        private readonly productsService: ProductsService,

        private readonly dataSource: DataSource) { }

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

    async findOne(producerId: number): Promise<ProducerDetailDto> {
        const producer = await this.findProducer(producerId);
        return ProducerMapper.toDetailDto(producer);
    }

    async findProductsByProducer(producerId: number, pagination: PaginationDto) {

        await this.findProducer(producerId);

        return this.productsService.findProductsByProducer(producerId, pagination);
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

    async findManagedProducts(producerId: number, pagination: PaginationDto, userId: number) {

        await this.validateOwnership(producerId, userId);

        return this.productsService.findManagedProducts(producerId, pagination);
    }

    private async findProducer(producerId: number, manager?: EntityManager): Promise<ProducerEntity> {

        if (!Number.isInteger(producerId) || producerId <= 0) {
            throw new BadRequestException(
                'El identificador debe ser un número entero positivo.',
            );
        }
        const repository = manager
            ? manager.getRepository(ProducerEntity)
            : this.producersRepository;

        const producer = await repository.findOne({
            where: {
                id: producerId,
                user: {
                    isActive: true,
                    role: UserRole.PRODUCER,
                },
            },
        });

        if (!producer) {
            throw new ProducerNotFoundError();
        }
        return producer;
    }
}