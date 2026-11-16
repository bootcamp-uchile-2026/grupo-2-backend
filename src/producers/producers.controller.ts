import { Controller, Get, Post, Patch, Body, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiBearerAuth, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiCreatedResponse, ApiConflictResponse } from '@nestjs/swagger';
import { ProducersService } from './producers.service';
import { ProducerDetailDto } from '../dto/producer-detail.dto';
import { PaginationDto } from '../dto/pagination.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../models/user.entity';
import { ProducerStatisticsDto } from '../dto/producer-statistics.dto';
import { StatisticsQueryDto } from '../dto/statistics-query.dto';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ManagedProductDto } from '../dto/managed-product.dto';
import { CategoryExistsPipe } from '../common/pipes/category-exists.pipe';

@ApiTags('Producers')
@Controller('producers')
export class ProducersController {

  constructor(
    private readonly producersService: ProducersService) { }


  @Post(':producerId/products')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PRODUCER)
  @ApiOperation({
    summary: 'Crear un producto del productor'
  })
  @ApiParam({
    name: 'producerId', type: Number, example: 12
  })
  @ApiCreatedResponse({
    type: ManagedProductDto
  })
  @ApiBadRequestResponse({
    description: 'Datos del producto inválidos.'
  })
  @ApiUnauthorizedResponse({
    description: 'Usuario no autenticado.'
  })
  @ApiForbiddenResponse({
    description: 'Acceso no autorizado.'
  })
  @ApiNotFoundResponse({
    description: 'Productor o categoría no encontrada.'
  })
  @ApiConflictResponse({
    description: 'Atributos especializados o de sustentabilidad inválidos.'
  })
  createProduct(@Param('producerId', ParseIntPipe) producerId: number, @Body(CategoryExistsPipe) dto: CreateProductDto, @CurrentUser() user: { id: number; role: UserRole }): Promise<ManagedProductDto> {
    return this.producersService.createProduct(producerId, dto, user.id);
  }
  @Get()
  @ApiOperation({
    summary: 'Obtener productores activos paginados',
  })
  @ApiOkResponse({
    description: 'Listado paginado de productores',
  })
  @ApiBadRequestResponse({
    description: 'Parámetros de paginación inválidos',
  })
  findAll(@Query() pagination: PaginationDto) {
    return this.producersService.findAll(pagination);
  }

  @Get(':producerId')
  @ApiOperation({
    summary: 'Obtener perfil público de un productor',
  })
  @ApiParam({
    name: 'producerId',
    type: Number,
    example: 9,
  })
  @ApiOkResponse({
    type: ProducerDetailDto,
  })
  @ApiBadRequestResponse({
    description: 'Identificador inválido',
  })
  @ApiNotFoundResponse({
    description: 'Productor no encontrado',
  })
  findOne(@Param('producerId', ParseIntPipe) producerId: number): Promise<ProducerDetailDto> {
    return this.producersService.findOne(producerId);
  }

  @Get(':producerId/products')
  @ApiOperation({
    summary: 'Obtener productos de un productor',
  })
  @ApiParam({
    name: 'producerId',
    type: Number,
    example: 9,
  })
  @ApiOkResponse({
    description: 'Listado paginado de productos',
  })
  @ApiBadRequestResponse({
    description: 'Parámetros inválidos',
  })
  @ApiNotFoundResponse({
    description: 'Productor no encontrado',
  })
  findProductsByProducer(@Param('producerId', ParseIntPipe) producerId: number,
    @Query() pagination: PaginationDto) {
    return this.producersService.findProductsByProducer(producerId, pagination);
  }

  @Get(':producerId/products/manage')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PRODUCER)
  @ApiOperation({
    summary: 'Consultar los productos activos e inactivos del productor'
  })
  @ApiParam({
    name: 'producerId',
    type: Number, example: 12
  })
  @ApiOkResponse({
    description: 'Listado paginado de productos del productor.'
  })
  @ApiBadRequestResponse({
    description: 'Parámetros inválidos.'
  })
  @ApiUnauthorizedResponse({
    description: 'Usuario no autenticado.'
  })
  @ApiForbiddenResponse({
    description: 'Acceso no autorizado.'
  })
  @ApiNotFoundResponse({
    description: 'Productor no encontrado.'
  })
  findManagedProducts(@Param('producerId', ParseIntPipe) producerId: number, @Query() pagination: PaginationDto, @CurrentUser() user: { id: number; role: UserRole }) {
    return this.producersService.findManagedProducts(producerId, pagination, user.id);
  }

  @Get(':producerId/products/:productId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PRODUCER)
  @ApiOperation({
    summary: 'Consultar un producto para su administración'
  })
  @ApiParam({
    name: 'producerId', type: Number, example: 12
  })
  @ApiParam({
    name: 'productId', type: Number, example: 65
  })
  @ApiOkResponse({
    type: ManagedProductDto
  })
  @ApiBadRequestResponse({
    description: 'Identificadores inválidos.'
  })
  @ApiUnauthorizedResponse({
    description: 'Usuario no autenticado.'
  })
  @ApiForbiddenResponse({
    description: 'Acceso no autorizado.'
  })
  @ApiNotFoundResponse({
    description: 'Productor o producto no encontrado.'
  })
  findManagedProduct(@Param('producerId', ParseIntPipe) producerId: number, @Param('productId', ParseIntPipe) productId: number, @CurrentUser() user: { id: number; role: UserRole }): Promise<ManagedProductDto> {
    return this.producersService.findManagedProduct(producerId, productId, user.id);
  }

  @Get(':producerId/statistics')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PRODUCER)
  @ApiOperation({
    summary: 'Consultar los indicadores comerciales del productor',
  })
  @ApiParam({
    name: 'producerId',
    example: 12,
  })
  @ApiOkResponse({
    type: ProducerStatisticsDto,
  })
  @ApiBadRequestResponse({
    description: 'Identificador o periodo inválido.',
  })
  @ApiUnauthorizedResponse({
    description: 'Usuario no autenticado.',
  })
  @ApiForbiddenResponse({
    description: 'Acceso no autorizado.',
  })
  @ApiNotFoundResponse({
    description: 'Productor no encontrado.',
  })
  getStatistics(@Param('producerId', ParseIntPipe) producerId: number, @Query() query: StatisticsQueryDto, @CurrentUser() user: { id: number; role: UserRole }): Promise<ProducerStatisticsDto> {
    return this.producersService.getStatistics(producerId, query, user.id);
  }

  @Patch(':producerId/products/:productId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PRODUCER)
  @ApiOperation({
    summary: 'Actualizar un producto, su stock, oferta o estado'
  })
  @ApiParam({
    name: 'producerId', type: Number, example: 12
  })
  @ApiParam({
    name: 'productId', type: Number, example: 65
  })
  @ApiOkResponse({
    type: ManagedProductDto
  })
  @ApiBadRequestResponse({
    description: 'Datos de actualización inválidos.'
  })
  @ApiUnauthorizedResponse({
    description: 'Usuario no autenticado.'
  })
  @ApiForbiddenResponse({
    description: 'Acceso no autorizado.'
  })
  @ApiNotFoundResponse({
    description: 'Productor o producto no encontrado.'
  })
  @ApiConflictResponse({
    description: 'La actualización no cumple las reglas de negocio.'
  })
  updateProduct(@Param('producerId', ParseIntPipe) producerId: number, @Param('productId', ParseIntPipe) productId: number, @Body() dto: UpdateProductDto, @CurrentUser() user: { id: number; role: UserRole }): Promise<ManagedProductDto> {
    return this.producersService.updateProduct(producerId, productId, dto, user.id);
  }
}