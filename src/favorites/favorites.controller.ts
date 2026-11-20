import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { AddFavoriteDto } from '../dto/add-favorite.dto';
import { FavoriteProductDto } from '../dto/favorite-product.dto';
import { UserRole } from '../models/user.entity';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles/roles.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Favorites')
@Controller('customers/:customerId/favorites')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.CUSTOMER)
export class FavoritesController {

  constructor(private readonly favoritesService: FavoritesService) { }

  @Get()
  @ApiParam({
    name: 'customerId',
    type: Number,
    example: 6,
    description: 'Identificador del cliente.',
  })
  @ApiOperation({ summary: 'Obtener favoritos de un cliente' })
  @ApiOkResponse({
    description: 'Lista de productos favoritos.',
    type: FavoriteProductDto,
    isArray: true,
  })
  @ApiBadRequestResponse({
    description: 'Identificador inválido.',
  })
  @ApiUnauthorizedResponse({
    description: 'Token inválido o inexistente.',
  })
  @ApiForbiddenResponse({
    description: 'Cliente inactivo o acceso denegado.',
  })
  @ApiNotFoundResponse({
    description: 'Cliente no encontrado.',
  })
  findAll(@Param('customerId', ParseIntPipe) customerId: number, @CurrentUser() user: { id: number; role: UserRole }): Promise<FavoriteProductDto[]> {
    return this.favoritesService.findAll(customerId, user.id);
  }

  @Post()
  @ApiParam({
    name: 'customerId',
    type: Number,
    example: 6,
    description: 'Identificador del cliente.',
  })
  @ApiOperation({ summary: 'Agregar un producto a favoritos' })
  @ApiBody({ type: AddFavoriteDto })
  @ApiCreatedResponse({
    description: 'Producto agregado correctamente.',
    type: FavoriteProductDto,
  })
  @ApiBadRequestResponse({
    description: 'Identificador o datos inválidos.',
  })
  @ApiUnauthorizedResponse({
    description: 'Token inválido o inexistente.',
  })
  @ApiForbiddenResponse({
    description: 'Cliente inactivo o acceso denegado.',
  })
  @ApiNotFoundResponse({
    description: 'Cliente o producto no encontrado.',
  })
  @ApiConflictResponse({
    description: 'El producto ya está en favoritos.',
  })
  add(@Param('customerId', ParseIntPipe) customerId: number,@Body() dto: AddFavoriteDto, @CurrentUser() user: { id: number; role: UserRole }): Promise<FavoriteProductDto> {
    return this.favoritesService.add(
      customerId,
      dto.productId,
      user.id,
    );
  }

  @Delete(':productId')
  @ApiParam({
    name: 'customerId',
    type: Number,
    example: 6,
    description: 'Identificador del cliente.',
  })
  @ApiParam({
    name: 'productId',
    type: Number,
    example: 65,
    description: 'Identificador del producto.',
  })
  @ApiOperation({ summary: 'Eliminar un producto de favoritos' })
  @ApiOkResponse({
    description: 'Favorito eliminado correctamente.',
  })
  @ApiBadRequestResponse({
    description: 'Identificador inválido.',
  })
  @ApiUnauthorizedResponse({
    description: 'Token inválido o inexistente.',
  })
  @ApiForbiddenResponse({
    description: 'Cliente inactivo o acceso denegado.',
  })
  @ApiNotFoundResponse({
    description: 'Cliente o favorito no encontrado.',
  })
  remove(@Param('customerId', ParseIntPipe) customerId: number,@Param('productId', ParseIntPipe) productId: number, @CurrentUser() user: { id: number; role: UserRole }): Promise<void> {
    return this.favoritesService.remove(
      customerId,
      productId,
      user.id,
    );
  }
}