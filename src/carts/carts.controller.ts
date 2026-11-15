import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CartsService } from './carts.service';
import { AddCartItemDto } from '../dto/add-cart-item.dto';
import { UpdateCartItemDto } from '../dto/update-cart-item.dto';
import { CartResponseDto } from '../dto/cart-response.dto';

@ApiTags('Carts')
@Controller('customers/:customerId/cart')
export class CartsController {

    constructor(private readonly cartsService: CartsService) { }

    @Get()
    @ApiParam({
        name: 'customerId',
        type: Number,
        example: 6,
        description: 'Identificador del cliente.'
    })
    @ApiOperation({ summary: 'Consultar el carrito de compras' })
    @ApiOkResponse({
        description: 'Carrito del cliente.',
        type: CartResponseDto
    })
    @ApiBadRequestResponse({ description: 'Identificador inválido.' })
    @ApiForbiddenResponse({ description: 'Cliente inactivo.' })
    @ApiNotFoundResponse({
        description: 'Cliente o carrito no encontrado.',
    })
    findOne(@Param('customerId', ParseIntPipe) customerId: number): Promise<CartResponseDto> {
        return this.cartsService.findOne(customerId);
    }

    @Post('items')
    @ApiParam({
        name: 'customerId',
        type: Number,
        example: 6,
        description: 'Identificador del cliente.'
    })
    @ApiOperation({ summary: 'Agregar un producto al carrito' })
    @ApiBody({ type: AddCartItemDto })
    @ApiCreatedResponse({
        description: 'Producto agregado correctamente.',
        type: CartResponseDto
    })
    @ApiBadRequestResponse({
        description: 'Identificador o datos inválidos.'
    })
    @ApiForbiddenResponse({ description: 'Cliente inactivo.' })
    @ApiNotFoundResponse({
        description: 'Cliente, carrito o producto no encontrado.',
    })
    @ApiConflictResponse({ description: 'Stock insuficiente.' })
    add(@Param('customerId', ParseIntPipe) customerId: number, @Body() dto: AddCartItemDto): Promise<CartResponseDto> {
        return this.cartsService.add(customerId, dto);
    }

    @Patch('items/:productId')
    @ApiParam({
        name: 'customerId',
        type: Number,
        example: 6,
        description: 'Identificador del cliente.'
    })
    @ApiParam({
        name: 'productId',
        type: Number,
        example: 65,
        description: 'Identificador del producto.'
    })
    @ApiOperation({ summary: 'Modificar la cantidad de un producto' })
    @ApiBody({ type: UpdateCartItemDto })
    @ApiOkResponse({
        description: 'Cantidad actualizada correctamente.',
        type: CartResponseDto
    })
    @ApiBadRequestResponse({
        description: 'Identificador o datos inválidos.'
    })
    @ApiForbiddenResponse({ description: 'Cliente inactivo.' })
    @ApiNotFoundResponse({
        description: 'Cliente, carrito o producto no encontrado.',
    })
    @ApiConflictResponse({ description: 'Stock insuficiente.' })
    update(@Param('customerId', ParseIntPipe) customerId: number,
        @Param('productId', ParseIntPipe) productId: number,
        @Body() dto: UpdateCartItemDto): Promise<CartResponseDto> {
        return this.cartsService.update(customerId, productId, dto);
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
    @ApiForbiddenResponse({ description: 'Cliente inactivo.' })
    @ApiNotFoundResponse({
        description: 'Cliente, carrito o producto no encontrado.',
    })
    remove(@Param('customerId', ParseIntPipe) customerId: number,@Param('productId', ParseIntPipe) productId: number): Promise<void> {
        return this.cartsService.remove(customerId, productId);
    }

    @Delete('items')
    @ApiParam({
        name: 'customerId',
        type: Number,
        example: 6,
        description: 'Identificador del cliente.'})
    @ApiOperation({ summary: 'Vaciar el carrito de compras' })
    @ApiOkResponse({
        description: 'Carrito vaciado correctamente.',
    })
    @ApiBadRequestResponse({ description: 'Identificador inválido.' })
    @ApiForbiddenResponse({ description: 'Cliente inactivo.' })
    @ApiNotFoundResponse({
        description: 'Cliente o carrito no encontrado.',
    })
    clear( @Param('customerId', ParseIntPipe) customerId: number): Promise<void> {
        return this.cartsService.clear(customerId);
    }
}