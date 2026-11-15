import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import {
    ApiTags, ApiOperation, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiBadRequestResponse, ApiConflictResponse, ApiForbiddenResponse, ApiNotFoundResponse,
    ApiParam,
    ApiBearerAuth
} from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { CustomerResponseDto } from '../dto/customer-response.dto';
import { PaginationDto } from '../dto/pagination.dto';
import { UserRole } from 'src/models/user.entity';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard';

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
    findAll(@Query() pagination: PaginationDto) {
        return this.customersService.findAll(pagination)
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
}
