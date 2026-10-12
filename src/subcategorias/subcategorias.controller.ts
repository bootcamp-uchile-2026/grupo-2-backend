import { BadRequestException, Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SubcategoriasService } from './subcategorias.service';
import { SubCategoriaDto } from 'src/model/dtos/subcategoria.dto';
import { ProductoSubCategoriaDto } from 'src/model/dtos/producto-subcategoria.dto';
import { PopularSubCategoriaDto } from 'src/model/dtos/popular-subcategoria.dto';

@ApiTags('Subcategorías')
@Controller()
export class SubcategoriasController {

  constructor(private readonly subcategoriasService: SubcategoriasService) { }

  @Get('categorias/:categoriaId/subcategorias')
  @ApiOperation({
    summary: 'Obtener subcategorías de una categoría',
    description:
      'Obtiene las subcategorías asociadas a una categoría a partir de su identificador.',
  })
  @ApiParam({
    name: 'categoriaId',
    description: 'Identificador de la categoría.',
    type: Number,
    example: 3,
  })
  @ApiOkResponse({
    description: 'Subcategorías obtenidas correctamente.',
    type: SubCategoriaDto,
    isArray: true,
  })
  @ApiBadRequestResponse({
    description: 'El identificador debe ser un número entero.',
  })
  findByCategory(
    @Param('categoriaId', ParseIntPipe) categoriaId: number,
  ): SubCategoriaDto[] {
    return this.subcategoriasService.obtenerSubcategorias(
      categoriaId,
    );
  }

  @Get('subcategorias/:subcategoriaId/productos')
  @ApiOperation({
    summary: 'Obtener productos de una subcategoría',
    description:
      'Obtiene los productos asociados a una subcategoría mediante su identificador.',
  })
  @ApiParam({
    name: 'subcategoriaId',
    description: 'Identificador de la subcategoría.',
    type: Number,
    example: 1,
  })
  @ApiOkResponse({
    description: 'Productos de la subcategoría obtenidos correctamente.',
    type: ProductoSubCategoriaDto,
    isArray: true,
  })
  @ApiBadRequestResponse({
    description: 'El identificador debe ser un número entero.',
  })
  @ApiNotFoundResponse({
    description: 'Subcategoría no encontrada.',
  })
  findProductsBySubcategory(
    @Param('subcategoriaId', ParseIntPipe) subcategoriaId: number,
  ): ProductoSubCategoriaDto[] {
    return this.subcategoriasService.obtenerProductosPorSubcategoria(
      subcategoriaId,
    );
  }

  @Get('subcategorias/:subcategoriaId/productos/populares')
  @ApiOperation({
    summary: 'Obtener productos populares de una subcategoría',
    description:
      'Obtiene los productos populares asociados a una subcategoría y permite limitar la cantidad de resultados.',
  })
  @ApiParam({
    name: 'subcategoriaId',
    description: 'Identificador de la subcategoría.',
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'cantidad',
    required: false,
    type: Number,
    example: 4,
    description:
      'Cantidad máxima de productos. Debe ser un número entero positivo. Por defecto es 4.',
  })
  @ApiOkResponse({
    description: 'Productos populares obtenidos correctamente.',
    type: PopularSubCategoriaDto,
    isArray: true,
  })
  @ApiBadRequestResponse({
    description:
      'El identificador o la cantidad no tienen un formato válido.',
  })
  @ApiNotFoundResponse({
    description: 'Subcategoría no encontrada.',
  })
  findPopularProducts(
    @Param('subcategoriaId', ParseIntPipe) subcategoriaId: number,
    @Query('cantidad') cantidad?: string,
  ): PopularSubCategoriaDto[] {
    let quantity = 4;

    if (cantidad !== undefined) {
      quantity = Number(cantidad);

      if (!Number.isInteger(quantity) || quantity <= 0) {
        throw new BadRequestException(
          'La cantidad debe ser un número entero positivo.',
        );
      }
    }

    return this.subcategoriasService.obtenerProductosPopulares(
      subcategoriaId,
      quantity,
    );
  }
}
