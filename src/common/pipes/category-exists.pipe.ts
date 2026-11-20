import {Injectable,PipeTransform, BadRequestException} from '@nestjs/common';
import { CategoriesService } from '../../categories/categories.service';
import { CreateProductDto } from '../../dto/create-product.dto';

@Injectable()
export class CategoryExistsPipe implements PipeTransform {

    constructor(
        private readonly categoriesService: CategoriesService) { }

    async transform( dto: CreateProductDto): Promise<CreateProductDto> {

        if (!Number.isInteger(dto.categoryId) || dto.categoryId <= 0) {
            throw new BadRequestException(
                'El identificador de la categoría debe ser un número entero positivo.',
            );
        }

        await this.categoriesService.findOne(
            dto.categoryId,
        );

        return dto;
    }
}