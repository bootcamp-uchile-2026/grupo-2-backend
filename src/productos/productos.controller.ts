import {Controller,Get,Param,ParseIntPipe,Query,} from '@nestjs/common';
import {ApiOperation,ApiParam,ApiQuery,ApiResponse,ApiTags,} from '@nestjs/swagger';
import { ProductoSubCategoriaDto } from '../model/dtos/producto-subcategoria.dto';
import { PopularSubCategoriaDto } from '../model/dtos/popular-subcategoria.dto';
import { ProductosService } from './productos.service';

@ApiTags('Productos')
@Controller('subcategorias')
export class ProductosController {
  constructor(
    private readonly productosService: ProductosService,
  ) {}

  @Get(':subcategoriaId/productos')
  @ApiOperation({
    summary: 'Obtener productos de una subcategoría',
  })
  @ApiParam({
    name: 'subcategoriaId',
    type: Number,
    example: 5,
    description:
      'Identificador de la subcategoría cuyos productos se desean consultar.',
  })
  @ApiResponse({
    status: 200,
    description: 'Productos obtenidos correctamente.',
    type: ProductoSubCategoriaDto,
    isArray: true,
  })
  obtenerProductos(
    @Param('subcategoriaId', ParseIntPipe) subcategoriaId: number,
  ): ProductoSubCategoriaDto[] {
    return this.productosService.obtenerProductosPorSubcategoria(
      subcategoriaId,
    );
  }

  @Get(':subcategoriaId/productos/populares')
  @ApiOperation({
    summary: 'Obtener productos populares de una subcategoría',
  })
  @ApiParam({
    name: 'subcategoriaId',
    type: Number,
    example: 5,
    description:
      'Identificador de la subcategoría cuyos productos populares se desean consultar.',
  })
  @ApiQuery({
    name: 'cantidad',
    required: false,
    type: Number,
    example: 4,
    description:
      'Cantidad máxima de productos populares a retornar. Por defecto es 4.',
  })
  @ApiResponse({
    status: 200,
    description: 'Productos populares obtenidos correctamente.',
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

    return this.productosService.obtenerProductosPopulares(
      subcategoriaId,
      cantidadNumerica,
    );
  }
}