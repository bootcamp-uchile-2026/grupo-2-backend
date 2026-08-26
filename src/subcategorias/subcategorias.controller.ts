import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SubcategoriasService } from './subcategorias.service';
import { SubCategoriaDto } from 'src/model/dtos/subcategoria.dto';
import { ProductoSubCategoriaDto } from 'src/model/dtos/producto-subcategoria.dto';
import { PopularSubCategoriaDto } from 'src/model/dtos/popular-subcategoria.dto';

@ApiTags('Subcategorías')
@Controller()
export class SubcategoriasController {
  constructor(
    private readonly subcategoriasService: SubcategoriasService,
  ) {}

  @Get('categorias/:categoriaId/subcategorias')
  @ApiOperation({
    summary: 'Obtener subcategorías de una categoría',
  })
  @ApiParam({
    name: 'categoriaId',
    type: Number,
    example: 3,
  })
  @ApiResponse({
    status: 200,
    type: SubCategoriaDto,
    isArray: true,
  })
  obtenerSubcategorias(
    @Param('categoriaId', ParseIntPipe) categoriaId: number,
  ): SubCategoriaDto[] {
    return this.subcategoriasService.obtenerSubcategorias(
      categoriaId,
    );
  }

  @Get('subcategorias/:subcategoriaId/productos')
  @ApiOperation({
    summary: 'Obtener productos de una subcategoría',
  })
  @ApiParam({
    name: 'subcategoriaId',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    type: ProductoSubCategoriaDto,
    isArray: true,
  })
  obtenerProductos(
    @Param('subcategoriaId', ParseIntPipe) subcategoriaId: number,
  ): ProductoSubCategoriaDto[] {
    return this.subcategoriasService.obtenerProductosPorSubcategoria(
      subcategoriaId,
    );
  }

  @Get('subcategorias/:subcategoriaId/productos/populares')
  @ApiOperation({
    summary: 'Obtener productos populares de una subcategoría',
  })
  @ApiParam({
    name: 'subcategoriaId',
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'cantidad',
    required: false,
    type: Number,
    example: 4,
    description:
      'Cantidad máxima de productos a retornar. Por defecto es 4.',
  })
  @ApiResponse({
    status: 200,
    type: PopularSubCategoriaDto,
    isArray: true,
  })
  obtenerProductosPopulares(
    @Param('subcategoriaId', ParseIntPipe) subcategoriaId: number,
    @Query('cantidad') cantidad?: string,
  ): PopularSubCategoriaDto[] {
    const cantidadNumerica = cantidad
      ? Number(cantidad)
      : 4;

    return this.subcategoriasService.obtenerProductosPopulares(
      subcategoriaId,
      cantidadNumerica,
    );
  }
}
