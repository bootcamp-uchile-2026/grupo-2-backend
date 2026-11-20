import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { PaginationDto } from '../dto/pagination.dto';
import { ProductQueryDto } from '../dto/product-query.dto';
import { NewProductsQueryDto } from '../dto/new-products-query.dto';
import { ProductSummaryDto } from '../dto/product-summary.dto';
import { ProductDetailDto } from '../dto/product-detail.dto';
import { BestSellingProductDto } from '../dto/best-selling-product.dto';
import { ProductGreenFootprintDto } from '../dto/product-green-footprint.dto';
import { BestSellingProductsQueryDto } from 'src/dto/best-selling-products-query.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {

  constructor(private readonly productsService: ProductsService) { }

  @Get()
  @ApiOperation({
    summary: 'Obtener catálogo paginado de productos',
  })
  @ApiOkResponse({
    description: 'Catálogo paginado de productos',
  })
  @ApiBadRequestResponse({
    description: 'Parámetros de consulta inválidos',
  })
  findAll(@Query() query: ProductQueryDto) {
    return this.productsService.findAll(query);
  }

  @Get('offers')
  @ApiOperation({
    summary: 'Obtener ofertas vigentes paginadas',
  })
  @ApiOkResponse({
    description: 'Listado paginado de ofertas',
  })
  @ApiBadRequestResponse({
    description: 'Parámetros de paginación inválidos',
  })
  findProductsOnSale(@Query() pagination: PaginationDto) {
    return this.productsService.findProductsOnSale(pagination)
  }

  @Get('best-sellers')
  @ApiOperation({
    summary: 'Obtener productos más vendidos',
    description: 'Unidades netas vendidas durante los últimos 30 días, con filtro opcional por categoría.'
  })
  @ApiOkResponse({
    type: BestSellingProductDto,
    isArray: true
  })
  @ApiBadRequestResponse({
    description: 'Parámetros de consulta inválidos'
  })
  findBestSellingProducts(@Query() query: BestSellingProductsQueryDto): Promise<BestSellingProductDto[]> {
    return this.productsService.findBestSellingProducts(query.quantity, query.categoryId);
  }

  @Get('new')
  @ApiOperation({
    summary: 'Obtener productos nuevos paginados',
  })
  @ApiOkResponse({
    description: 'Listado paginado de productos nuevos',
  })
  @ApiBadRequestResponse({
    description: 'Parámetros de paginación inválidos',
  })
  findNewProducts(@Query() pagination: NewProductsQueryDto) {
    return this.productsService.findNewProducts(pagination);
  }

  @Get(':productId')
  @ApiOperation({
    summary: 'Obtener detalle de un producto',
  })
  @ApiParam({
    name: 'productId',
    type: Number,
    example: 65,
  })
  @ApiOkResponse({
    type: ProductDetailDto,
  })
  @ApiBadRequestResponse({
    description: 'Identificador inválido',
  })
  @ApiNotFoundResponse({
    description: 'Producto no encontrado',
  })
  findOne(@Param('productId', ParseIntPipe) productId: number): Promise<ProductDetailDto> {
    return this.productsService.findOne(productId)
  }

  @Get(':productId/green-footprint')
  @ApiOperation({
    summary: 'Obtener huella verde del producto',
  })
  @ApiParam({
    name: 'productId',
    type: Number,
    example: 65,
  })
  @ApiOkResponse({
    type: ProductGreenFootprintDto,
  })
  @ApiBadRequestResponse({
    description: 'Identificador inválido',
  })
  @ApiNotFoundResponse({
    description: 'Producto no encontrado',
  })
  findGreenFootprint(@Param('productId', ParseIntPipe) productId: number): Promise<ProductGreenFootprintDto> {
    return this.productsService.findGreenFootprint(productId)
  }

  @Get(':productId/reviews')
  @ApiOperation({
    summary: 'Obtener valoraciones paginadas',
  })
  @ApiParam({
    name: 'productId',
    type: Number,
    example: 65,
  })
  @ApiOkResponse({
    description: 'Listado paginado de valoraciones',
  })
  @ApiBadRequestResponse({
    description: 'Parámetros inválidos',
  })
  @ApiNotFoundResponse({
    description: 'Producto no encontrado',
  })
  findReviews(@Param('productId', ParseIntPipe) productId: number,
    @Query() pagination: PaginationDto) {
    return this.productsService.findReviews(productId, pagination)
  }

  @Get(':productId/related')
  @ApiOperation({
    summary: 'Obtener productos de la misma categoría',
  })
  @ApiParam({
    name: 'productId',
    type: Number,
    example: 65,
  })
  @ApiQuery({
    name: 'quantity',
    type: Number,
    required: true,
    example: 5,
  })
  @ApiOkResponse({
    type: ProductSummaryDto,
    isArray: true,
  })
  @ApiBadRequestResponse({
    description: 'Identificador o cantidad inválida',
  })
  @ApiNotFoundResponse({
    description: 'Producto no encontrado',
  })
  findRelatedProducts(@Param('productId', ParseIntPipe) productId: number,
    @Query('quantity', ParseIntPipe) quantity: number): Promise<ProductSummaryDto[]> {
    return this.productsService.findRelatedProducts(productId, quantity)
  }
}
