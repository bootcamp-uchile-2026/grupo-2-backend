import {BadRequestException, Controller, Get, Param, ParseIntPipe, Query} from '@nestjs/common';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags} from '@nestjs/swagger';
import { ProductsService } from './productos.service';
import { ProductSearchDto } from '../dto/product-search.dto';
import { ProductOfferDto } from '../dto/product-offer.dto';
import { BestSellingProductDto } from '../dto/best-selling-product.dto';
import { NewProductSummaryDto } from '../dto/new-product-summary.dto';
import { ProductDetailDto } from '../dto/product-detail.dto';
import { ProductGreenFootprintDto } from '../dto/product-green-footprint.dto';
import { ProductReviewDto } from '../dto/product-review.dto';
import { RelatedProductDto } from '../dto/related-product.dto';

@ApiTags('Productos')
@Controller('productos')
export class ProductsController {

  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({
    summary: 'Buscar productos',
    description:
      'Busca productos del catálogo mediante un término de búsqueda obligatorio. Devuelve los productos coincidentes o un arreglo vacío si no encuentra resultados.',
  })
  @ApiQuery({
    name: 'buscar',
    type: String,
    required: true,
    description: 'Texto utilizado para buscar productos',
    example: 'polera',
  })
  @ApiOkResponse({
    description: 'Productos encontrados.',
    type: ProductSearchDto,
    isArray: true,
  })
  @ApiBadRequestResponse({
    description: 'El término de búsqueda es obligatorio.',
  })
  searchProducts(
    @Query('buscar') search: string): ProductSearchDto[] {
    if (!search || search.trim() === '') {
      throw new BadRequestException(
        'El término de búsqueda es obligatorio',
      );
    }
    return this.productsService.searchProducts(search);
  }

  @Get('ofertas')
  @ApiOperation({
    summary: 'Obtener productos en oferta',
    description:
      'Obtiene los productos que actualmente poseen una oferta vigente.',
  })
  @ApiOkResponse({
    description: 'Productos en oferta obtenidos correctamente.',
    type: ProductOfferDto,
    isArray: true,
  })
  findProductsOnSale(): ProductOfferDto[] {
    return this.productsService.findProductsOnSale();
  }

  @Get('mas-vendidos')
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
      'Cantidad de productos más vendidos que se desea obtener. Debe ser un número entero positivo.',
  })
  @ApiOkResponse({
    description: 'Productos más vendidos obtenidos correctamente.',
    type: BestSellingProductDto,
    isArray: true,
  })
  @ApiBadRequestResponse({
    description:
      'El parámetro cantidad debe ser un número entero positivo.',
  })
  findBestSellingProducts(
    @Query('cantidad', ParseIntPipe) quantity: number): BestSellingProductDto[] {
    if (quantity <= 0) {
      throw new BadRequestException(
        'La cantidad debe ser un número entero positivo.',
      );
    }
    return this.productsService.findBestSellingProducts(
      quantity,
    );
  }

  @Get('nuevos')
  @ApiOperation({
    summary: 'Obtener productos nuevos',
    description:
      'Obtiene los productos recientemente incorporados al catálogo de BuenOrigen.',
  })
  @ApiOkResponse({
    description: 'Productos nuevos obtenidos correctamente.',
    type: NewProductSummaryDto,
    isArray: true,
  })
  findNewProducts(): NewProductSummaryDto[] {
    return this.productsService.findNewProducts();
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
    description: 'Identificador único del producto.',
  })
  @ApiOkResponse({
    description: 'Producto obtenido correctamente.',
    type: ProductDetailDto,
  })
  @ApiBadRequestResponse({
    description: 'El identificador debe ser un número entero.',
  })
  @ApiNotFoundResponse({
    description: 'Producto no encontrado.',
  })
  findOne(
    @Param('productoId', ParseIntPipe) productId: number): ProductDetailDto {
    return this.productsService.findOne(productId);
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
    description: 'Identificador único del producto.',
  })
  @ApiOkResponse({
    description:
      'Información de Huella Verde obtenida correctamente.',
    type: ProductGreenFootprintDto,
  })
  @ApiBadRequestResponse({
    description: 'El identificador debe ser un número entero.',
  })
  @ApiNotFoundResponse({
    description: 'Producto no encontrado.',
  })
  findGreenFootprint(
    @Param('productoId', ParseIntPipe) productId: number): ProductGreenFootprintDto {
    return this.productsService.findGreenFootprint(
      productId,
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
    description: 'Identificador único del producto.',
  })
  @ApiOkResponse({
    description: 'Valoraciones obtenidas correctamente.',
    type: ProductReviewDto,
    isArray: true,
  })
  @ApiBadRequestResponse({
    description: 'El identificador debe ser un número entero.',
  })
  @ApiNotFoundResponse({
    description: 'Producto no encontrado.',
  })
  findReviews(
    @Param('productoId', ParseIntPipe) productId: number): ProductReviewDto[] {
    return this.productsService.findReviews(productId);
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
    description: 'Identificador único del producto.',
  })
  @ApiQuery({
    name: 'cantidad',
    type: Number,
    required: true,
    example: 4,
    description:
      'Cantidad máxima de productos relacionados que se desea obtener. Debe ser un número entero positivo.',
  })
  @ApiOkResponse({
    description:
      'Productos relacionados obtenidos correctamente.',
    type: RelatedProductDto,
    isArray: true,
  })
  @ApiBadRequestResponse({
    description:
      'El identificador y la cantidad deben ser números enteros válidos. La cantidad debe ser positiva.',
  })
  @ApiNotFoundResponse({
    description: 'Producto no encontrado.',
  })
  findRelatedProducts(
    @Param('productoId', ParseIntPipe) productId: number,
    @Query('cantidad', ParseIntPipe) quantity: number): RelatedProductDto[] {
    if (quantity <= 0) {
      throw new BadRequestException(
        'La cantidad debe ser un número entero positivo.',
      );
    }
    return this.productsService.findRelatedProducts(
      productId,
      quantity,
    );
  }
}
