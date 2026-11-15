import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from '../dto/create-address.dto';
import { UpdateAddressDto } from '../dto/update-address.dto';
import { AddressResponseDto } from '../dto/address-response.dto';

@ApiTags('Addresses')
@Controller('customers/:customerId/addresses')
export class AddressesController {

    constructor(private readonly addressesService: AddressesService) {}

    @Get()
    @ApiParam({
        name: 'customerId',
        type: Number,
        example: 6,
        description: 'Identificador del cliente.'})
    @ApiOperation({ summary: 'Consultar las direcciones del cliente' })
    @ApiOkResponse({
        description: 'Listado de direcciones activas.',
        type: AddressResponseDto,
        isArray: true})
    @ApiBadRequestResponse({
        description: 'Identificador inválido.',
    })
    @ApiForbiddenResponse({
        description: 'Cliente inactivo.',
    })
    @ApiNotFoundResponse({
        description: 'Cliente no encontrado.',
    })
    findAll(@Param('customerId', ParseIntPipe) customerId: number): Promise<AddressResponseDto[]> {
        return this.addressesService.findAll(customerId);
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
    @ApiBadRequestResponse({
        description: 'Identificador inválido.',
    })
    @ApiForbiddenResponse({
        description: 'Cliente inactivo.',
    })
    @ApiNotFoundResponse({
        description: 'Cliente o dirección no encontrada.',
    })
    findOne(@Param('customerId', ParseIntPipe) customerId: number,@Param('addressId', ParseIntPipe) addressId: number): Promise<AddressResponseDto> {
        return this.addressesService.findOne(customerId, addressId);
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
    @ApiBadRequestResponse({
        description: 'Identificador o datos inválidos.',
    })
    @ApiForbiddenResponse({
        description: 'Cliente inactivo.',
    })
    @ApiNotFoundResponse({
        description: 'Cliente no encontrado.',
    })
    create(@Param('customerId', ParseIntPipe) customerId: number,@Body() dto: CreateAddressDto): Promise<AddressResponseDto> {
        return this.addressesService.create(customerId, dto);
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
    @ApiBadRequestResponse({
        description: 'Identificador o datos inválidos.',
    })
    @ApiForbiddenResponse({
        description: 'Cliente inactivo.',
    })
    @ApiNotFoundResponse({
        description: 'Cliente o dirección no encontrada.',
    })
    update(@Param('customerId', ParseIntPipe) customerId: number,@Param('addressId', ParseIntPipe) addressId: number, @Body() dto: UpdateAddressDto): Promise<AddressResponseDto> {
        return this.addressesService.update(customerId, addressId, dto);
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
    @ApiBadRequestResponse({
        description: 'Identificador inválido.',
    })
    @ApiForbiddenResponse({
        description: 'Cliente inactivo.',
    })
    @ApiNotFoundResponse({
        description: 'Cliente o dirección no encontrada.',
    })
    setDefault(@Param('customerId', ParseIntPipe) customerId: number, @Param('addressId', ParseIntPipe) addressId: number): Promise<AddressResponseDto> {
        return this.addressesService.setDefault(customerId, addressId);
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
    @ApiBadRequestResponse({
        description: 'Identificador inválido.',
    })
    @ApiForbiddenResponse({
        description: 'Cliente inactivo.',
    })
    @ApiNotFoundResponse({
        description: 'Cliente o dirección no encontrada.',
    })
    remove(@Param('customerId', ParseIntPipe) customerId: number,@Param('addressId', ParseIntPipe) addressId: number): Promise<void> {
        return this.addressesService.remove(customerId, addressId);
    }
}