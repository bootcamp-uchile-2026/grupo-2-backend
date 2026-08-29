import {BadRequestException, Controller,Get,Param,ParseIntPipe,Query,} from '@nestjs/common';
import {ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation,ApiParam,ApiQuery,ApiResponse,ApiTags,} from '@nestjs/swagger';
import { ProductoSubCategoriaDto } from '../model/dtos/producto-subcategoria.dto';
import { PopularSubCategoriaDto } from '../model/dtos/popular-subcategoria.dto';
import { ProductosService } from './productos.service';
import { ProductoBusquedaDto } from 'src/model/dtos/ProductoBusqueda.dto';
import { ProductoOfertaDto } from 'src/model/dtos/ProductoOferta.dto';
import { ProductoMasVendidoDto } from 'src/model/dtos/ProductoMasVendido.dto';
import { ProductoResumenNuevosDto } from 'src/model/dtos/ProductoResumenNuevos.dto';
import { ProductoDetalleDto } from 'src/model/dtos/ProductoDetalle.dto';
import { HuellaVerdeProductoDto } from 'src/model/dtos/HuellaVerdeProducto.dto';
import { ValoracionDetalleDto } from 'src/model/dtos/ValoracionDetalleProducto.dto';
import { ProductoRelacionadoDto } from 'src/model/dtos/ProductoRelacionado.dto';

@ApiTags('Productos')
@Controller('productos')

export class ProductosController {
  constructor(
    private readonly productosService: ProductosService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Buscar productos',
  })
  @ApiQuery({
    name: 'buscar',
    type: String,
    required: true,
    description: 'Texto utilizado para buscar productos',
    example: 'bolsa',
  })
  @ApiOkResponse({
    description: 'Productos encontrados',
    type: ProductoBusquedaDto,
    isArray: true,
  })
  @ApiBadRequestResponse({
    description: 'El término de búsqueda es obligatorio',
  })
  buscarProductos(
    @Query('buscar') buscar: string,
  ): ProductoBusquedaDto[] {

    if (!buscar || buscar.trim() === '') {
      throw new BadRequestException(
        'El término de búsqueda es obligatorio',
      );
    }

    return this.productosService.buscarProductos(buscar);
  }

@Get('ofertas')
@ApiOperation({
  summary: 'Obtener productos en oferta',
  description:
    'Obtiene los productos que actualmente poseen una oferta vigente.',
})
@ApiOkResponse({
  description: 'Productos en oferta obtenidos correctamente',
  type: ProductoOfertaDto,
  isArray: true,
})
obtenerProductosEnOferta(): ProductoOfertaDto[] {
  return this.productosService.obtenerProductosEnOferta();
}

@Get("mas-vendidos")
@ApiOperation({
  summary: 'Obtener productos más vendidos',
  description:
    'Obtiene una cantidad determinada de productos ordenados según su nivel de ventas.',
})
@ApiQuery({
  name: 'cantidad',
  type: Number,
  required: true,
  example: 5,
  description:
    'Cantidad de productos más vendidos que se desea obtener.',
})
@ApiOkResponse({
  description: 'Productos más vendidos obtenidos correctamente.',
  type: ProductoMasVendidoDto,
  isArray: true,
})
obtenerProductosMasVendidos(
  @Query('cantidad', ParseIntPipe) cantidad: number,
): ProductoMasVendidoDto[] {
  return this.productosService.obtenerProductosMasVendidos(cantidad);
}

@Get('nuevos')
@ApiOperation({
  summary: 'Obtener productos nuevos',
  description:
    'Obtiene los productos recientemente incorporados al catálogo de EcoTienda.',
})
@ApiOkResponse({
  description: 'Productos nuevos obtenidos correctamente.',
  type: ProductoResumenNuevosDto,
  isArray: true,
})
obtenerProductosNuevos(): ProductoResumenNuevosDto[] {
  return this.productosService.obtenerProductosNuevos();
}

@Get(':productoId')
@ApiOperation({
  summary: 'Obtener producto por ID',
  description:
    'Obtiene el detalle de un producto a partir de su identificador.',
})
@ApiParam({
  name: 'productoId',
  type: Number,
  example: 1,
  description: 'Identificador único del producto',
})
@ApiOkResponse({
  description: 'Producto obtenido correctamente.',
  type: ProductoDetalleDto,
})
obtenerProductoPorId(
  @Param('productoId', ParseIntPipe) productoId: number,
): ProductoDetalleDto {
  return this.productosService.obtenerProductoPorId(productoId);
}

@Get(':productoId/huella-verde')
@ApiOperation({
  summary: 'Obtener Huella Verde de un producto',
  description:
    'Obtiene la información de sustentabilidad asociada a un producto.',
})
@ApiParam({
  name: 'productoId',
  type: Number,
  example: 1,
  description: 'Identificador único del producto',
})
@ApiOkResponse({
  description:
    'Información de Huella Verde obtenida correctamente.',
  type: HuellaVerdeProductoDto,
})
@ApiNotFoundResponse({
  description: 'Producto no encontrado.',
})
obtenerHuellaVerde(
  @Param('productoId', ParseIntPipe)
  productoId: number,
): HuellaVerdeProductoDto {
  return this.productosService.obtenerHuellaVerde(
    productoId,
  );
}

@Get(':productoId/valoraciones')
@ApiOperation({
  summary: 'Obtener valoraciones de un producto',
  description:
    'Obtiene las valoraciones públicas asociadas a un producto.',
})
@ApiParam({
  name: 'productoId',
  type: Number,
  example: 1,
  description: 'Identificador único del producto',
})
@ApiOkResponse({
  description: 'Valoraciones obtenidas correctamente.',
  type: ValoracionDetalleDto,
  isArray: true,
})
@ApiNotFoundResponse({
  description: 'Producto no encontrado.',
})
obtenerValoraciones(
  @Param('productoId', ParseIntPipe)
  productoId: number,
): ValoracionDetalleDto[] {
  return this.productosService.obtenerValoraciones(
    productoId,
  );
}

@Get(':productoId/relacionados')
@ApiOperation({
  summary: 'Obtener productos relacionados',
  description:
    'Obtiene productos de la misma subcategoría relacionados con el producto consultado.',
})
@ApiParam({
  name: 'productoId',
  type: Number,
  example: 1,
  description: 'Identificador único del producto',
})
@ApiQuery({
  name: 'cantidad',
  type: Number,
  required: true,
  example: 4,
  description:
    'Cantidad máxima de productos relacionados que se desea obtener.',
})
@ApiOkResponse({
  description: 'Productos relacionados obtenidos correctamente.',
  type: ProductoRelacionadoDto,
  isArray: true,
})
@ApiNotFoundResponse({
  description: 'Producto no encontrado.',
})
obtenerProductosRelacionados(
  @Param('productoId', ParseIntPipe) productoId: number,
  @Query('cantidad', ParseIntPipe) cantidad: number,
): ProductoRelacionadoDto[] {
  return this.productosService.obtenerProductosRelacionados(
    productoId,
    cantidad,
  );
}

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