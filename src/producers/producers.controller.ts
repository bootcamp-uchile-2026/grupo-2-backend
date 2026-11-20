import { Controller, Get, Post, Patch, Body, Param, ParseIntPipe, Query, UseGuards, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiBearerAuth, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiCreatedResponse, ApiConflictResponse, ApiConsumes, ApiBody, ApiResponse, ApiNoContentResponse } from '@nestjs/swagger';
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
import { CreateProducerDto } from '../dto/create-producer.dto';
import { UpdateProducerDto } from '../dto/update-producer.dto';
import { ProducerProfileDto } from '../dto/producer-profile.dto';
import { UpdateUserStatusDto } from '../dto/update-user-status.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UploadImageDto } from '../dto/upload-image.dto';
import { ProductImageDto } from '../dto/product-image.dto';

@ApiTags('Producers')
@Controller('producers')
export class ProducersController {

  constructor(
    private readonly producersService: ProducersService) { }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Registrar un nuevo emprendedor'
  })
  @ApiCreatedResponse({
    type: ProducerProfileDto
  })
  @ApiBadRequestResponse({
    description: 'Datos del emprendedor inválidos.'
  })
  @ApiUnauthorizedResponse({
    description: 'Usuario no autenticado.'
  })
  @ApiForbiddenResponse({
    description: 'Acceso no autorizado.'
  })
  @ApiConflictResponse({
    description: 'El correo electrónico ya está registrado.'
  })
  create(@Body() dto: CreateProducerDto): Promise<ProducerProfileDto> {
    return this.producersService.create(dto);
  }

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

  @Post(':producerId/products/:productId/images')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PRODUCER)
  @ApiOperation({
    summary: 'Subir una imagen de un producto propio'
  })
  @ApiParam({
    name: 'producerId',
    type: Number,
    example: 12
  })
  @ApiParam({
    name: 'productId',
    type: Number,
    example: 65
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UploadImageDto
  })
  @ApiCreatedResponse({
    type: ProductImageDto
  })
  @ApiBadRequestResponse({
    description: 'Archivo o identificadores inválidos.'
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
  @ApiResponse({
    status: 413,
    description: 'El archivo supera el tamaño permitido.'
  })
  @UseInterceptors(FileInterceptor('file', {
    storage: memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  }))
  addProductImage(@Param('producerId', ParseIntPipe) producerId: number, @Param('productId', ParseIntPipe) productId: number, @UploadedFile(new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 + 1 }),
      new FileTypeValidator({ fileType: /^image\/(jpeg|png|webp)$/ }),
    ],
  })) archivo: Express.Multer.File, @CurrentUser() user: { id: number; role: UserRole }): Promise<ProductImageDto> {
    return this.producersService.addProductImage(producerId, productId, archivo, user.id);
  }

  @Patch(':producerId/products/:productId/images/:imageId/primary')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PRODUCER)
  @ApiOperation({
    summary: 'Establecer imagen principal de un producto'
  })
  @ApiParam({
    name: 'producerId', example: 12
  })
  @ApiParam({
    name: 'productId', example: 65
  })
  @ApiParam({
    name: 'imageId', example: 2
  })
  @ApiOkResponse({
    type: ProductImageDto
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
    description: 'Productor, producto o imagen no encontrada.'
  })
  setPrimaryProductImage(@Param('producerId', ParseIntPipe) producerId: number, @Param('productId', ParseIntPipe) productId: number, @Param('imageId', ParseIntPipe) imageId: number, @CurrentUser() user: { id: number; role: UserRole }): Promise<ProductImageDto> {

    return this.producersService.setPrimaryProductImage(producerId, productId, imageId, user.id);
  }

  @Delete(':producerId/products/:productId/images/:imageId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PRODUCER)
  @ApiOperation({
    summary: 'Eliminar una imagen de un producto'
  })
  @ApiParam({
    name: 'producerId', example: 12
  })
  @ApiParam({
    name: 'productId', example: 65
  })
  @ApiParam({
    name: 'imageId', example: 1
  })
  @ApiNoContentResponse({
    description: 'Imagen eliminada correctamente.'
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
    description: 'Productor, producto o imagen no encontrada.'
  })
  deleteProductImage(@Param('producerId', ParseIntPipe) producerId: number, @Param('productId', ParseIntPipe) productId: number, @Param('imageId', ParseIntPipe) imageId: number, @CurrentUser() user: { id: number; role: UserRole }): Promise<void> {

    return this.producersService.deleteProductImage(producerId, productId, imageId, user.id);
  }

  @Post(':producerId/profile/image')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PRODUCER)
  @ApiOperation({ summary: 'Cargar o reemplazar foto de perfil del emprendedor' })
  @ApiParam({ name: 'producerId', example: 12 })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UploadImageDto
  })
  @ApiCreatedResponse({
    type: ProducerProfileDto
  })
  @ApiBadRequestResponse({
    description: 'Archivo o identificador inválido.'
  })
  @ApiUnauthorizedResponse({
    description: 'Usuario no autenticado.'
  })
  @ApiForbiddenResponse({
    description: 'Acceso no autorizado.'
  })
  @ApiNotFoundResponse({
    description: 'Emprendedor no encontrado.'
  })
  @ApiResponse({
    status: 413,
    description: 'El archivo supera el tamaño permitido.'
  })
  @UseInterceptors(FileInterceptor('file', {
    storage: memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  }))
  uploadProfileImage(@Param('producerId', ParseIntPipe) producerId: number, @UploadedFile(new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 + 1 }),
      new FileTypeValidator({ fileType: /^image\/(jpeg|png|webp)$/ }),
    ],
  })) archivo: Express.Multer.File, @CurrentUser() user: { id: number; role: UserRole }): Promise<ProducerProfileDto> {

    return this.producersService.uploadImage(producerId, archivo, user.id, 'perfiles');
  }

  @Post(':producerId/logo')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PRODUCER)
  @ApiOperation({
    summary: 'Cargar o reemplazar logo del emprendedor'
  })
  @ApiParam({
    name: 'producerId', example: 12
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UploadImageDto
  })
  @ApiCreatedResponse({
    type: ProducerProfileDto
  })
  @ApiBadRequestResponse({
    description: 'Archivo o identificador inválido.'
  })
  @ApiUnauthorizedResponse({
    description: 'Usuario no autenticado.'
  })
  @ApiForbiddenResponse({
    description: 'Acceso no autorizado.'
  })
  @ApiNotFoundResponse({
    description: 'Emprendedor no encontrado.'
  })
  @ApiResponse({
    status: 413,
    description: 'El archivo supera el tamaño permitido.'
  })
  @UseInterceptors(FileInterceptor('file', {
    storage: memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  }))
  uploadLogo(@Param('producerId', ParseIntPipe) producerId: number, @UploadedFile(new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 + 1 }),
      new FileTypeValidator({ fileType: /^image\/(jpeg|png|webp)$/ }),
    ],
  })) archivo: Express.Multer.File, @CurrentUser() user: { id: number; role: UserRole }): Promise<ProducerProfileDto> {

    return this.producersService.uploadImage(producerId, archivo, user.id, 'logos');
  }

  @Post(':producerId/banner')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PRODUCER)
  @ApiOperation({ summary: 'Cargar o reemplazar banner del emprendedor' })
  @ApiParam({ name: 'producerId', example: 12 })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UploadImageDto
  })
  @ApiCreatedResponse({
    type: ProducerProfileDto
  })
  @ApiBadRequestResponse({
    description: 'Archivo o identificador inválido.'
  })
  @ApiUnauthorizedResponse({
    description: 'Usuario no autenticado.'
  })
  @ApiForbiddenResponse({
    description: 'Acceso no autorizado.'
  })
  @ApiNotFoundResponse({
    description: 'Emprendedor no encontrado.'
  })
  @ApiResponse({
    status: 413,
    description: 'El archivo supera el tamaño permitido.'
  })
  @UseInterceptors(FileInterceptor('file', {
    storage: memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  }))
  uploadBanner(@Param('producerId', ParseIntPipe) producerId: number, @UploadedFile(new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 + 1 }),
      new FileTypeValidator({ fileType: /^image\/(jpeg|png|webp)$/ }),
    ],
  })) archivo: Express.Multer.File, @CurrentUser() user: { id: number; role: UserRole }): Promise<ProducerProfileDto> {

    return this.producersService.uploadImage(producerId, archivo, user.id, 'banners');
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

  @Get('manage')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Consultar emprendedores activos e inactivos'
  })
  @ApiOkResponse({
    description: 'Listado paginado de emprendedores.'
  })
  @ApiBadRequestResponse({
    description: 'Parámetros de paginación inválidos.'
  })
  @ApiUnauthorizedResponse({
    description: 'Usuario no autenticado.'
  })
  @ApiForbiddenResponse({
    description: 'Acceso no autorizado.'
  })
  findManagedProducers(@Query() pagination: PaginationDto) {
    return this.producersService.findManagedProducers(pagination);
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

  @Get(':producerId/manage')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Consultar información administrativa de un emprendedor'
  })
  @ApiParam({
    name: 'producerId',
    type: Number,
    example: 12
  })
  @ApiOkResponse({
    type: ProducerProfileDto
  })
  @ApiBadRequestResponse({
    description: 'Identificador inválido.'
  })
  @ApiUnauthorizedResponse({
    description: 'Usuario no autenticado.'
  })
  @ApiForbiddenResponse({
    description: 'Acceso no autorizado.'
  })
  @ApiNotFoundResponse({
    description: 'Emprendedor no encontrado.'
  })
  findManagedProducer(@Param('producerId', ParseIntPipe) producerId: number): Promise<ProducerProfileDto> {
    return this.producersService.findManagedProducer(producerId);
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

  @Get(':producerId/profile')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PRODUCER)
  @ApiOperation({
    summary: 'Consultar perfil propio del emprendedor'
  })
  @ApiParam({
    name: 'producerId',
    type: Number,
    example: 12
  })
  @ApiOkResponse({
    type: ProducerProfileDto
  })
  @ApiBadRequestResponse({
    description: 'Identificador inválido.'
  })
  @ApiUnauthorizedResponse({
    description: 'Usuario no autenticado.'
  })
  @ApiForbiddenResponse({
    description: 'Acceso no autorizado.'
  })
  @ApiNotFoundResponse({
    description: 'Emprendedor no encontrado.'
  })
  findProfile(@Param('producerId', ParseIntPipe) producerId: number, @CurrentUser() user: { id: number; role: UserRole }): Promise<ProducerProfileDto> {
    return this.producersService.findProfile(producerId, user.id);
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

  @Patch(':producerId/profile')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PRODUCER)
  @ApiOperation({
    summary: 'Actualizar perfil personal y comercial del emprendedor'
  })
  @ApiParam({
    name: 'producerId',
    type: Number,
    example: 12
  })
  @ApiOkResponse({
    type: ProducerProfileDto
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
    description: 'Emprendedor no encontrado.'
  })
  @ApiConflictResponse({
    description: 'El correo electrónico ya está registrado.'
  })
  updateProfile(@Param('producerId', ParseIntPipe) producerId: number, @Body() dto: UpdateProducerDto, @CurrentUser() user: { id: number; role: UserRole }): Promise<ProducerProfileDto> {
    return this.producersService.updateProfile(producerId, dto, user.id);
  }

  @Patch(':producerId/status')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Activar o desactivar la cuenta de un emprendedor'
  })
  @ApiParam({
    name: 'producerId',
    type: Number,
    example: 12
  })
  @ApiOkResponse({
    type: ProducerProfileDto
  })
  @ApiBadRequestResponse({
    description: 'Datos inválidos.'
  })
  @ApiUnauthorizedResponse({
    description: 'Usuario no autenticado.'
  })
  @ApiForbiddenResponse({
    description: 'Acceso no autorizado.'
  })
  @ApiNotFoundResponse({
    description: 'Emprendedor no encontrado.'
  })
  updateStatus(@Param('producerId', ParseIntPipe) producerId: number, @Body() dto: UpdateUserStatusDto): Promise<ProducerProfileDto> {
    return this.producersService.updateStatus(producerId, dto);
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