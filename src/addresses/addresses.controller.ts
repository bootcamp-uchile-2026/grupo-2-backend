import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from '../dto/create-address.dto';
import { UpdateAddressDto } from '../dto/update-address.dto';
import { AddressResponseDto } from '../dto/address-response.dto';
import { UserRole } from '../models/user.entity';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles/roles.guard';

@ApiTags('Addresses')
@Controller('customers/:customerId/addresses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.CUSTOMER)
export class AddressesController {

    constructor(private readonly addressesService: AddressesService) { }

    @Get()
    @ApiParam({
        name: 'customerId',
        type: Number,
        example: 6,
        description: 'Identificador del cliente.',
    })
    @ApiOperation({ summary: 'Consultar las direcciones del cliente' })
    @ApiOkResponse({
        description: 'Listado de direcciones activas.',
        type: AddressResponseDto,
        isArray: true,
    })
    @ApiBadRequestResponse({ description: 'Identificador inválido.' })
    @ApiUnauthorizedResponse({ description: 'Token inválido o inexistente.' })
    @ApiForbiddenResponse({ description: 'Cliente inactivo o acceso denegado.' })
    @ApiNotFoundResponse({ description: 'Cliente no encontrado.' })
    findAll(@Param('customerId', ParseIntPipe) customerId: number, @CurrentUser() user: { id: number; role: UserRole }): Promise<AddressResponseDto[]> {

        return this.addressesService.findAll(customerId, user.id);
    }

    @Get(':addressId')
    @ApiParam({
        name: 'customerId',
        type: Number,
        example: 6,
        description: 'Identificador del cliente.',
    })
    @ApiParam({
        name: 'addressId',
        type: Number,
        example: 11,
        description: 'Identificador de la dirección.',
    })
    @ApiOperation({ summary: 'Consultar una dirección del cliente' })
    @ApiOkResponse({
        description: 'Dirección del cliente.',
        type: AddressResponseDto,
    })
    @ApiBadRequestResponse({ description: 'Identificador inválido.' })
    @ApiUnauthorizedResponse({ description: 'Token inválido o inexistente.' })
    @ApiForbiddenResponse({ description: 'Cliente inactivo o acceso denegado.' })
    @ApiNotFoundResponse({
        description: 'Cliente o dirección no encontrada.',
    })
    findOne(@Param('customerId', ParseIntPipe) customerId: number, @Param('addressId', ParseIntPipe) addressId: number,@CurrentUser() user: { id: number; role: UserRole }): Promise<AddressResponseDto> {
        return this.addressesService.findOne(customerId, addressId, user.id);
    }

    @Post()
    @ApiParam({
        name: 'customerId',
        type: Number,
        example: 6,
        description: 'Identificador del cliente.',
    })
    @ApiOperation({ summary: 'Registrar una dirección' })
    @ApiBody({ type: CreateAddressDto })
    @ApiCreatedResponse({
        description: 'Dirección registrada correctamente.',
        type: AddressResponseDto,
    })
    @ApiBadRequestResponse({ description: 'Identificador o datos inválidos.' })
    @ApiUnauthorizedResponse({ description: 'Token inválido o inexistente.' })
    @ApiForbiddenResponse({ description: 'Cliente inactivo o acceso denegado.' })
    @ApiNotFoundResponse({ description: 'Cliente no encontrado.' })
    create(@Param('customerId', ParseIntPipe) customerId: number, @Body() dto: CreateAddressDto, @CurrentUser() user: { id: number; role: UserRole }): Promise<AddressResponseDto> {

        return this.addressesService.create(customerId, dto, user.id);
    }

    @Patch(':addressId')
    @ApiParam({
        name: 'customerId',
        type: Number,
        example: 6,
        description: 'Identificador del cliente.',
    })
    @ApiParam({
        name: 'addressId',
        type: Number,
        example: 11,
        description: 'Identificador de la dirección.',
    })
    @ApiOperation({ summary: 'Modificar una dirección' })
    @ApiBody({ type: UpdateAddressDto })
    @ApiOkResponse({
        description: 'Dirección actualizada correctamente.',
        type: AddressResponseDto,
    })
    @ApiBadRequestResponse({ description: 'Identificador o datos inválidos.' })
    @ApiUnauthorizedResponse({ description: 'Token inválido o inexistente.' })
    @ApiForbiddenResponse({ description: 'Cliente inactivo o acceso denegado.' })
    @ApiNotFoundResponse({
        description: 'Cliente o dirección no encontrada.',
    })
    update(@Param('customerId', ParseIntPipe) customerId: number,@Param('addressId', ParseIntPipe) addressId: number,@Body() dto: UpdateAddressDto,@CurrentUser() user: { id: number; role: UserRole })
    : Promise<AddressResponseDto> {

        return this.addressesService.update(customerId, addressId, dto, user.id);
    }

    @Patch(':addressId/default')
    @ApiParam({
        name: 'customerId',
        type: Number,
        example: 6,
        description: 'Identificador del cliente.',
    })
    @ApiParam({
        name: 'addressId',
        type: Number,
        example: 11,
        description: 'Identificador de la dirección.',
    })
    @ApiOperation({ summary: 'Establecer una dirección predeterminada' })
    @ApiOkResponse({
        description: 'Dirección predeterminada actualizada correctamente.',
        type: AddressResponseDto,
    })
    @ApiBadRequestResponse({ description: 'Identificador inválido.' })
    @ApiUnauthorizedResponse({ description: 'Token inválido o inexistente.' })
    @ApiForbiddenResponse({ description: 'Cliente inactivo o acceso denegado.' })
    @ApiNotFoundResponse({
        description: 'Cliente o dirección no encontrada.',
    })
    setDefault(@Param('customerId', ParseIntPipe) customerId: number, @Param('addressId', ParseIntPipe) addressId: number,@CurrentUser() user: { id: number; role: UserRole }): Promise<AddressResponseDto> {

        return this.addressesService.setDefault(customerId, addressId, user.id);
    }

    @Delete(':addressId')
    @ApiParam({
        name: 'customerId',
        type: Number,
        example: 6,
        description: 'Identificador del cliente.',
    })
    @ApiParam({
        name: 'addressId',
        type: Number,
        example: 11,
        description: 'Identificador de la dirección.',
    })
    @ApiOperation({ summary: 'Eliminar una dirección' })
    @ApiOkResponse({
        description: 'Dirección eliminada correctamente.',
    })
    @ApiBadRequestResponse({ description: 'Identificador inválido.' })
    @ApiUnauthorizedResponse({ description: 'Token inválido o inexistente.' })
    @ApiForbiddenResponse({ description: 'Cliente inactivo o acceso denegado.' })
    @ApiNotFoundResponse({
        description: 'Cliente o dirección no encontrada.',
    })
    remove(@Param('customerId', ParseIntPipe) customerId: number, @Param('addressId', ParseIntPipe) addressId: number, @CurrentUser() user: { id: number; role: UserRole }): Promise<void> {
        return this.addressesService.remove(customerId, addressId, user.id);
    }
}