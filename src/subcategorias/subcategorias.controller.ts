import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SubcategoriasService } from './subcategorias.service';
import { SubCategoriaDto } from 'src/model/dtos/subcategoria.dto';

@ApiTags('Subcategorías')
@Controller('subcategorias')
export class SubcategoriasController {
    constructor(private readonly subcategoriasService: SubcategoriasService) { }

    @Get(':categoriaId/subcategorias')
    @ApiOperation({
        summary: 'Obtener subcategorías de una categoría',
        description: 'Obtiene las subcategorías asociadas a una categoría específica del catálogo.',
    })
    @ApiParam({
        name: 'categoriaId',
        description: 'Identificador de la categoría',
        type: Number,
        example: 3,
    })
    @ApiResponse({
        status: 200,
        description: 'Subcategorías obtenidas correctamente.',
        type: SubCategoriaDto,
        isArray: true,
    })
    obtenerSubcategorias(
        @Param('categoriaId', ParseIntPipe) categoriaId: number,
    ): SubCategoriaDto[] {
        return this.subcategoriasService.obtenerSubcategorias(categoriaId);
    }

}
