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
    description:'Obtiene las subcategorías asociadas a una categoría a partir de su identificador.',
  })
  @ApiParam({
    name: 'categoriaId',
    description: 'Identificador de la categoría cuyas subcategorías se desean consultar.',
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
    return this.subcategoriasService.obtenerSubcategorias(
      categoriaId,
    );
  }

  @Get('subcategorias/:subcategoriaId/productos')
  @ApiOperation({
    summary: 'Obtener productos de una subcategoría',
    description: 'Obtiene el listado de productos asociados a una subcategoría mediante su identificador.',
  })
  @ApiParam({
    name: 'subcategoriaId',
    description: 'Identificador de la subcategoría que se desea consultar.',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Productos de la subcategoría obtenidos correctamente.',
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
    description: 'Obtiene los productos populares asociados a una subcategoría, permitiendo limitar la cantidad de resultados mediante un parámetro opcional.',
  })
  @ApiParam({
    name: 'subcategoriaId',
    description: 'Identificador de la subcategoría que se desea consultar.',
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
    description: 'Productos populares de la subcategoría obtenidos correctamente.',
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
