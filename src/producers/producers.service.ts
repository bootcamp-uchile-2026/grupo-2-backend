import { Injectable, BadRequestException, ForbiddenException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { ProducerEntity } from '../models/producer.entity';
import { UserRole } from '../models/user.entity';
import { PaginationDto } from '../dto/pagination.dto';
import { ProducerSummaryDto } from '../dto/producer-summary.dto';
import { ProducerDetailDto } from '../dto/producer-detail.dto';
import { ProducerNotFoundError } from '../common/errors/producer-not-found.error';
import { ProducerMapper } from './producer.mapper';
import { ProductsService } from '../products/products.service';

@Injectable()
export class ProducersService {

    constructor(
        @InjectRepository(ProducerEntity)
        private readonly producersRepository: Repository<ProducerEntity>,
        private readonly productsService: ProductsService) { }

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

    async validateOwnership(producerId: number,userId: number, manager?: EntityManager): Promise<void> {

        const producer = await this.findProducer(producerId, manager);

        if (producer.userId !== userId) {
            throw new ForbiddenException(
                'No tienes permisos para acceder a este perfil.',
            );
        }
    }

    private async findProducer(producerId: number,manager?: EntityManager): Promise<ProducerEntity> {

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