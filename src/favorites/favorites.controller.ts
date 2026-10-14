import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse, ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation,
  ApiParam, ApiTags} from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { AddFavoriteDto } from '../dto/add-favorite.dto';
import { FavoriteProductDto } from '../dto/favorite-product.dto';

@ApiTags('Favoritos')
@Controller('customers/:customerId/favoritos')
export class FavoritesController {

  constructor(private readonly favoritesService: FavoritesService) { }

  @Get()
  @ApiParam({
    name: 'customerId',
    type: Number,
    example: 1,
    description: 'Identificador del cliente.',
  })
  @ApiOperation({ summary: 'Obtener favoritos de un cliente' })
  @ApiOkResponse({
    description: 'Lista de productos favoritos.',
    type: FavoriteProductDto,
    isArray: true,
  })
  @ApiBadRequestResponse({ description: 'Identificador inválido.' })
  @ApiNotFoundResponse({ description: 'Cliente no encontrado.' })
  findAll( @Param('customerId', ParseIntPipe) customerId: number): FavoriteProductDto[] {
    return this.favoritesService.findAll(customerId);
  }

  @Post()
  @ApiParam({
    name: 'customerId',
    type: Number,
    example: 1,
    description: 'Identificador del cliente.',
  })
  @ApiOperation({ summary: 'Agregar un producto a favoritos' })
  @ApiBody({ type: AddFavoriteDto })
  @ApiCreatedResponse({
    description: 'Producto agregado correctamente.',
    type: FavoriteProductDto,
  })
  @ApiBadRequestResponse({ description: 'Identificador o body inválido.' })
  @ApiNotFoundResponse({ description: 'Cliente o producto no encontrado.' })
  @ApiConflictResponse({ description: 'El producto ya está en favoritos.' })
  add(
    @Param('customerId', ParseIntPipe) customerId: number,
    @Body() dto: AddFavoriteDto,
  ): FavoriteProductDto {
    return this.favoritesService.add(customerId, dto.productId);
  }

  @Delete(':productId')
  @ApiParam({
    name: 'customerId',
    type: Number,
    example: 1,
    description: 'Identificador del cliente.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un producto de favoritos' })
  @ApiParam({
    name: 'productId',
    type: Number,
    example: 12,
    description: 'Identificador del producto.',
  })
  @ApiNoContentResponse({ description: 'Favorito eliminado correctamente.' })
  @ApiBadRequestResponse({ description: 'Identificador inválido.' })
  @ApiNotFoundResponse({
    description: 'Cliente, producto o favorito no encontrado.',
  })
  remove(
    @Param('customerId', ParseIntPipe) customerId: number,
    @Param('productId', ParseIntPipe) productId: number,
  ): void {
    this.favoritesService.remove(customerId, productId);
  }

}
