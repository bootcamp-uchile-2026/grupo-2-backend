import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { CartsService } from './carts.service';
import { AddCartItemDto } from '../dto/add-cart-item.dto';
import { UpdateCartItemDto } from '../dto/update-cart-item.dto';
import { CartResponseDto } from '../dto/cart-response.dto';
import { UserRole } from '../models/user.entity';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles/roles.guard';

@ApiTags('Carts')
@Controller('customers/:customerId/cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.CUSTOMER)
export class CartsController {

    constructor(private readonly cartsService: CartsService) { }

    @Get()
    @ApiParam({
        name: 'customerId',
        type: Number,
        example: 6,
        description: 'Identificador del cliente.',
    })
    @ApiOperation({ summary: 'Consultar el carrito de compras' })
    @ApiOkResponse({
        description: 'Carrito del cliente.',
        type: CartResponseDto,
    })
    @ApiBadRequestResponse({ description: 'Identificador inválido.' })
    @ApiUnauthorizedResponse({ description: 'Token inválido o inexistente.' })
    @ApiForbiddenResponse({ description: 'Cliente inactivo o acceso denegado.' })
    @ApiNotFoundResponse({
        description: 'Cliente o carrito no encontrado.',
    })
    findOne(@Param('customerId', ParseIntPipe) customerId: number, @CurrentUser() user: { id: number; role: UserRole }): Promise<CartResponseDto> {

        return this.cartsService.findOne(customerId, user.id);
    }

    @Post('items')
    @ApiParam({
        name: 'customerId',
        type: Number,
        example: 6,
        description: 'Identificador del cliente.',
    })
    @ApiOperation({ summary: 'Agregar un producto al carrito' })
    @ApiBody({ type: AddCartItemDto })
    @ApiCreatedResponse({
        description: 'Producto agregado correctamente.',
        type: CartResponseDto,
    })
    @ApiBadRequestResponse({
        description: 'Identificador o datos inválidos.',
    })
    @ApiUnauthorizedResponse({ description: 'Token inválido o inexistente.' })
    @ApiForbiddenResponse({ description: 'Cliente inactivo o acceso denegado.' })
    @ApiNotFoundResponse({
        description: 'Cliente, carrito o producto no encontrado.',
    })
    @ApiConflictResponse({ description: 'Stock insuficiente.' })
    add(@Param('customerId', ParseIntPipe) customerId: number, @Body() dto: AddCartItemDto, @CurrentUser() user: { id: number; role: UserRole }): Promise<CartResponseDto> {
        return this.cartsService.add(customerId, dto, user.id);
    }

    @Patch('items/:productId')
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
    @ApiOperation({ summary: 'Modificar la cantidad de un producto' })
    @ApiBody({ type: UpdateCartItemDto })
    @ApiOkResponse({
        description: 'Cantidad actualizada correctamente.',
        type: CartResponseDto,
    })
    @ApiBadRequestResponse({
        description: 'Identificador o datos inválidos.',
    })
    @ApiUnauthorizedResponse({ description: 'Token inválido o inexistente.' })
    @ApiForbiddenResponse({ description: 'Cliente inactivo o acceso denegado.' })
    @ApiNotFoundResponse({
        description: 'Cliente, carrito o producto no encontrado.',
    })
    @ApiConflictResponse({ description: 'Stock insuficiente.' })
    update(@Param('customerId', ParseIntPipe) customerId: number, @Param('productId', ParseIntPipe) productId: number, @Body() dto: UpdateCartItemDto,@CurrentUser() user: { id: number; role: UserRole },
    ): Promise<CartResponseDto> {

        return this.cartsService.update(customerId, productId, dto, user.id);
    }

    @Delete('items/:productId')
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
    @ApiOperation({ summary: 'Eliminar un producto del carrito' })
    @ApiOkResponse({
        description: 'Producto eliminado correctamente.',
    })
    @ApiBadRequestResponse({ description: 'Identificador inválido.' })
    @ApiUnauthorizedResponse({ description: 'Token inválido o inexistente.' })
    @ApiForbiddenResponse({ description: 'Cliente inactivo o acceso denegado.' })
    @ApiNotFoundResponse({
        description: 'Cliente, carrito o producto no encontrado.',
    })
    remove(@Param('customerId', ParseIntPipe) customerId: number, @Param('productId', ParseIntPipe) productId: number, @CurrentUser() user: { id: number; role: UserRole }): Promise<void> {

        return this.cartsService.remove(customerId, productId, user.id);
    }

    @Delete('items')
    @ApiParam({
        name: 'customerId',
        type: Number,
        example: 6,
        description: 'Identificador del cliente.',
    })
    @ApiOperation({ summary: 'Vaciar el carrito de compras' })
    @ApiOkResponse({
        description: 'Carrito vaciado correctamente.',
    })
    @ApiBadRequestResponse({ description: 'Identificador inválido.' })
    @ApiUnauthorizedResponse({ description: 'Token inválido o inexistente.' })
    @ApiForbiddenResponse({ description: 'Cliente inactivo o acceso denegado.' })
    @ApiNotFoundResponse({
        description: 'Cliente o carrito no encontrado.',
    })
    clear(@Param('customerId', ParseIntPipe) customerId: number,@CurrentUser() user: { id: number; role: UserRole }): Promise<void> {
        return this.cartsService.clear(customerId, user.id);
    }
}