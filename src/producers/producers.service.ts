import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
        private readonly productsService: ProductsService) {}

    async findAll(pagination: PaginationDto) {
        const { page, size, sortBy, sortDirection } = pagination;

        const allowedSortFields = ['id', 'businessName', 'location', 'createdAt'];

        if (!allowedSortFields.includes(sortBy)) {
            throw new BadRequestException('Campo de ordenamiento inválido.')}

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

        const totalElements = await this.producersRepository.count({ where });

        const content: ProducerSummaryDto[] = producers.map(producer => ProducerMapper.toSummaryDto(producer));

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

        if (producerId <= 0) {
            throw new BadRequestException(
                'El identificador debe ser un número entero positivo.');}

        const producer = await this.producersRepository.findOne({
            where: {
                id: producerId,
                user: {
                    isActive: true,
                    role: UserRole.PRODUCER,
                },
            },
        });

        if (!producer) {
            throw new ProducerNotFoundError()}

        return ProducerMapper.toDetailDto(producer);
    }

    async findProductsByProducer(producerId: number, pagination: PaginationDto) {

        await this.findOne(producerId);

        return this.productsService.findProductsByProducer(producerId, pagination);
    }
}
