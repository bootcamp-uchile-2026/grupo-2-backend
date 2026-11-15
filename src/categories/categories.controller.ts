import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CategoryDto } from '../dto/category.dto';
import { PaginationDto } from '../dto/pagination.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {

    constructor(
        private readonly categoriesService: CategoriesService) { }

    @Get()
    @ApiOperation({
        summary: 'Obtener categorías paginadas',
    })
    @ApiOkResponse({
        description: 'Listado paginado de categorías',
    })
    @ApiBadRequestResponse({
        description: 'Parámetros de paginación inválidos',
    })
    findAll(@Query() pagination: PaginationDto) {
        return this.categoriesService.findAll(pagination);
    }

    @Get(':categoryId')
    @ApiOperation({
        summary: 'Obtener detalle de una categoría',
    })
    @ApiParam({
        name: 'categoryId',
        type: Number,
        example: 1,
    })
    @ApiOkResponse({
        type: CategoryDto,
    })
    @ApiBadRequestResponse({
        description: 'Identificador inválido',
    })
    @ApiNotFoundResponse({
        description: 'Categoría no encontrada',
    })
    findOne(
        @Param('categoryId', ParseIntPipe) categoryId: number): Promise<CategoryDto> {
        return this.categoriesService.findOne(categoryId);
    }
}