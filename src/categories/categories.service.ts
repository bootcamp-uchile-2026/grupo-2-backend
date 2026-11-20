import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CategoryEntity } from '../models/category.entity';
import { CategoryNotFoundError } from '../common/errors/category-not-found.error';
import { CategoryDto } from '../dto/category.dto';
import { PaginationDto } from '../dto/pagination.dto';
import { FilesService } from '../files/files.service';
import { FileEntity } from '../models/file.entity';

@Injectable()
export class CategoriesService {

    constructor(
        @InjectRepository(CategoryEntity)
        private readonly categoriesRepository: Repository<CategoryEntity>,
        private readonly dataSource: DataSource,
        private readonly filesService: FilesService) { }

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
            imageFileId: category.imageFileId,
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
            where: { id: categoryId }
        });

        if (!category) { throw new CategoryNotFoundError() }

        return {
            id: category.id,
            name: category.name,
            description: category.description,
            imageFileId: category.imageFileId,
        };
    }

    async uploadImage(categoryId: number, archivo: Express.Multer.File): Promise<CategoryDto> {

        await this.findOne(categoryId);

        let storageKey: string | undefined;

        try {
            const previousStorageKey = await this.dataSource.transaction(async manager => {

                const category = await manager.findOne(CategoryEntity, {
                    where: { id: categoryId },
                    lock: { mode: 'pessimistic_write' },
                });

                if (!category) {
                    throw new CategoryNotFoundError();
                }

                const previousFileId = category.imageFileId;

                const file = await this.filesService.saveImage(archivo, 'categorias', manager);

                storageKey = file.storageKey;

                await manager.update(CategoryEntity, category.id, {
                    imageFileId: file.id,
                });

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

        return this.findOne(categoryId);
    }
}
