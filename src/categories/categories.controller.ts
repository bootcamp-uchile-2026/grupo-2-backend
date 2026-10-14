import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CategoryDto } from '../dto/category.dto';

@ApiTags('Categorías')
@Controller('categorias')
export class CategoriesController {

    constructor(private readonly categoriesService: CategoriesService) { }

    @Get()
    @ApiOperation({ summary: 'Obtener todas las categorías' })
    @ApiOkResponse({ type: CategoryDto, isArray: true })
    findAll(): CategoryDto[] {
        return this.categoriesService.findAll();
    }

    @Get(':categoriaId')
    @ApiOperation({ summary: 'Obtener detalle de una categoría' })
    @ApiParam({
        name: 'categoriaId',
        type: Number,
        example: 1,
    })
    @ApiOkResponse({ type: CategoryDto })
    @ApiBadRequestResponse({ description: 'Identificador inválido' })
    @ApiNotFoundResponse({ description: 'Categoría no encontrada' })
    findOne(
        @Param('categoriaId', ParseIntPipe) categoryId: number,
    ): CategoryDto {
        return this.categoriesService.findOne(categoryId);
    }
}