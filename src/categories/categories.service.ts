import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../models/category.entity';
import { CategoryNotFoundError } from '../common/errors/category-not-found.error';
import { CategoryDto } from '../dto/category.dto';
import { PaginationDto } from '../dto/pagination.dto';

@Injectable()
export class CategoriesService {

    constructor(
        @InjectRepository(CategoryEntity)
        private readonly categoriesRepository: Repository<CategoryEntity>) { }

    async findAll(pagination: PaginationDto) {

        const { page, size, sortBy, sortDirection } = pagination;

        const allowedSortFields = ['id', 'name', 'description'];

        if (!allowedSortFields.includes(sortBy)) {
            throw new BadRequestException('Campo de ordenamiento inválido.');
        }

        const categories = await this.categoriesRepository.find({
            skip: page * size,
            take: size,
            order: {
                [sortBy]: sortDirection,
                id: sortBy === 'id' ? sortDirection : 'ASC',
            },
        });

        const totalElements = await this.categoriesRepository.count();

        const content: CategoryDto[] = categories.map(category => ({
            id: category.id,
            name: category.name,
            description: category.description,
        }));

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

    async findOne(categoryId: number): Promise<CategoryDto> {
        if (categoryId <= 0) {
            throw new BadRequestException(
                'El identificador debe ser un número entero positivo.');
        }

        const category = await this.categoriesRepository.findOne({
            where: { id: categoryId }});

        if (!category) {throw new CategoryNotFoundError()}

        return {
            id: category.id,
            name: category.name,
            description: category.description,
        };
    }
}
