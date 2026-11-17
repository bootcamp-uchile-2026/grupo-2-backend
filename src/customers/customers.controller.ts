import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import {
    ApiTags, ApiOperation, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiBadRequestResponse, ApiConflictResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiParam, ApiBearerAuth, ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { CustomerResponseDto } from '../dto/customer-response.dto';
import { PaginationDto } from '../dto/pagination.dto';
import { UserRole } from '../models/user.entity';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles/roles.guard';
import { JwtAuthGuard } from '../common/guards/jwt-auth/jwt-auth.guard';
import { CustomerGreenFootprintDto } from 'src/dto/customer-green-footprint.dto';
import { UpdateUserStatusDto } from '../dto/update-user-status.dto';

@ApiTags('Customers')
@Controller('customers')
export class CustomersController {

    constructor(private readonly customersService: CustomersService) { }

    @Post()
    @ApiOperation({
        summary: 'Crear cliente',
        description: 'Registra un nuevo cliente en BuenOrigen.',
    })
    @ApiBody({ type: CreateCustomerDto })
    @ApiCreatedResponse({
        description: 'Cliente creado correctamente.',
        type: CustomerResponseDto,
    })
    @ApiBadRequestResponse({
        description: 'Los datos del cliente no son válidos.',
    })
    @ApiConflictResponse({
        description: 'El correo electrónico ya está registrado.',
    })
    create(@Body() dto: CreateCustomerDto): Promise<CustomerResponseDto> {
        return this.customersService.create(dto);
    }


    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get()
    @ApiOperation({
        summary: 'Obtener listado paginado de clientes',
    })
    @ApiOkResponse({
        description: 'Listado paginado de clientes.',
    })
    @ApiBadRequestResponse({
        description: 'Parámetros de paginación inválidos.',
    })
    @ApiForbiddenResponse({
        description: 'Acceso denegado.',
    })
    @ApiUnauthorizedResponse({
        description: 'Token inválido o inexistente.',
    })
    findAll(@Query() pagination: PaginationDto) {
        return this.customersService.findAll(pagination)
    }

    @Get(':customerId/green-footprint')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.CUSTOMER)
    @ApiOperation({
        summary: 'Consultar el CO2e evitado acumulado del cliente',
    })
    @ApiParam({
        name: 'customerId',
        example: 6,
    })
    @ApiOkResponse({
        type: CustomerGreenFootprintDto,
    })
    @ApiBadRequestResponse({
        description: 'Identificador inválido.',
    })
    @ApiUnauthorizedResponse({
        description: 'Usuario no autenticado.',
    })
    @ApiForbiddenResponse({
        description: 'Acceso no autorizado.',
    })
    @ApiNotFoundResponse({
        description: 'Cliente no encontrado.',
    })
    getGreenFootprint(@Param('customerId', ParseIntPipe) customerId: number, @CurrentUser() user: { id: number; role: UserRole }): Promise<CustomerGreenFootprintDto> {
        return this.customersService.getGreenFootprint(customerId, user.id);
    }

    @Get(':customerId/green-points/movements')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.CUSTOMER)
    @ApiOperation({
        summary: 'Consultar los movimientos de puntos verdes del cliente',
    })
    @ApiParam({
        name: 'customerId',
        example: 6,
    })
    @ApiOkResponse({
        description: 'Listado paginado de movimientos de puntos verdes.',
    })
    @ApiBadRequestResponse({
        description: 'Parámetros de consulta inválidos.',
    })
    @ApiUnauthorizedResponse({
        description: 'Usuario no autenticado.',
    })
    @ApiForbiddenResponse({
        description: 'Acceso no autorizado.',
    })
    @ApiNotFoundResponse({
        description: 'Cliente no encontrado.',
    })
    findGreenPointMovements(@Param('customerId', ParseIntPipe) customerId: number, @Query() pagination: PaginationDto, @CurrentUser() user: { id: number; role: UserRole }) {
        return this.customersService.findGreenPointMovements(customerId, pagination, user.id);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.CUSTOMER, UserRole.ADMIN)
    @Get(':id')
    @ApiOperation({
        summary: 'Consultar cliente por ID',
    })
    @ApiParam({
        name: 'id',
        type: Number,
        example: 6,
    })
    @ApiOkResponse({
        description: 'Cliente obtenido correctamente.',
        type: CustomerResponseDto,
    })
    @ApiBadRequestResponse({
        description: 'Identificador inválido.',
    })
    @ApiNotFoundResponse({
        description: 'Cliente no encontrado.',
    })
    @ApiForbiddenResponse({
        description: 'No tienes permisos para consultar este perfil.',
    })
    @ApiUnauthorizedResponse({
        description: 'Token inválido o inexistente.',
    })
    async findOne(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() user: { id: number; role: UserRole },
    ): Promise<CustomerResponseDto> {

        if (user.role === UserRole.CUSTOMER) {
            await this.customersService.validateOwnership(id, user.id);
        }

        return this.customersService.findOne(id);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.CUSTOMER, UserRole.ADMIN)
    @Patch(':id')
    @ApiOperation({
        summary: 'Actualizar cliente por ID',
    })
    @ApiParam({
        name: 'id',
        type: Number,
        example: 6,
    })
    @ApiBody({ type: UpdateCustomerDto })
    @ApiOkResponse({
        description: 'Cliente actualizado correctamente.',
        type: CustomerResponseDto,
    })
    @ApiBadRequestResponse({
        description: 'Datos de actualización inválidos.',
    })
    @ApiNotFoundResponse({
        description: 'Cliente no encontrado.',
    })
    @ApiConflictResponse({
        description: 'El correo electrónico ya está registrado.',
    })
    @ApiForbiddenResponse({
        description: 'No tienes permisos para actualizar este perfil.',
    })
    @ApiUnauthorizedResponse({
        description: 'Token inválido o inexistente.',
    })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateCustomerDto,
        @CurrentUser() user: { id: number; role: UserRole },
    ): Promise<CustomerResponseDto> {

        if (user.role === UserRole.CUSTOMER) {
            await this.customersService.validateOwnership(id, user.id);
        }

        return this.customersService.update(id, dto);
    }

    @Patch(':id/status')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiOperation({
        summary: 'Activar o desactivar la cuenta de un cliente'
    })
    @ApiParam({
        name: 'id',
        type: Number,
        example: 6
    })
    @ApiOkResponse({
        type: CustomerResponseDto
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
        description: 'Cliente no encontrado.'
    })
    updateStatus(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserStatusDto): Promise<CustomerResponseDto> {
        return this.customersService.updateStatus(id, dto);
    }
}
