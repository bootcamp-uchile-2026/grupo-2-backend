import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation,
  ApiParam, ApiTags
} from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { AddFavoriteDto } from '../dto/add-favorite.dto';
import { FavoriteProductDto } from '../dto/favorite-product.dto';
import { UserRole } from 'src/models/user.entity';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@ApiTags('Favorites')
@Controller('customers/:customerId/favorites')
export class FavoritesController {

  constructor(private readonly favoritesService: FavoritesService) { }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.CUSTOMER)
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
  @ApiBadRequestResponse({ description: 'Identificador inválido.' })
  @ApiNotFoundResponse({ description: 'Cliente no encontrado.' })
  findAll(
    @Param('customerId', ParseIntPipe) customerId: number,
    @CurrentUser() user: { id: number; role: UserRole }
  ): Promise<FavoriteProductDto[]> {
    return this.favoritesService.findAll(customerId, user.id, user.role);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.CUSTOMER)
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
  @ApiBadRequestResponse({ description: 'Identificador o body inválido.' })
  @ApiNotFoundResponse({ description: 'Cliente o producto no encontrado.' })
  @ApiConflictResponse({ description: 'El producto ya está en favoritos.' })
  add(
    @Param('customerId', ParseIntPipe) customerId: number,
    @Body() dto: AddFavoriteDto,
    @CurrentUser() user: { id: number; role: UserRole }
  ): Promise<FavoriteProductDto> {
    return this.favoritesService.add(
    customerId,
    dto.productId,
    user.id,
    user.role
);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.CUSTOMER)
  @Delete(':productId')
  @ApiParam({
    name: 'customerId',
    type: Number,
    example: 65,
    description: 'Identificador del cliente.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un producto de favoritos' })
  @ApiParam({
    name: 'productId',
    type: Number,
    example: 6,
    description: 'Identificador del producto.',
  })
  @ApiNoContentResponse({ description: 'Favorito eliminado correctamente.' })
  @ApiBadRequestResponse({ description: 'Identificador inválido.' })
  @ApiNotFoundResponse({
    description: 'Cliente o favorito no encontrado.',
  })
  remove(
    @Param('customerId', ParseIntPipe) customerId: number,
    @Param('productId', ParseIntPipe) productId: number,
    @CurrentUser() user: { id: number; role: UserRole }
  ): Promise<void> {
    return this.favoritesService.remove(
    customerId,
    productId,
    user.id,
    user.role
);
  }
}
