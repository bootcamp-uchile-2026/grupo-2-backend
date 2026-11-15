import { Body,Controller, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiBadRequestResponse, ApiConflictResponse, ApiForbiddenResponse, ApiNotFoundResponse,
    ApiHeader, ApiParam} from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { CustomerResponseDto } from '../dto/customer-response.dto';
import { PaginationDto } from '../dto/pagination.dto';
import { AdminGuard } from '../common/guards/admin-access/admin.guard';

@ApiTags('Customers')
@Controller('customers')
export class CustomersController {

    constructor(private readonly customersService: CustomersService) {}

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
        return this.customersService.create(dto);}

    @Get()
    @UseGuards(AdminGuard)
    @ApiOperation({
        summary: 'Obtener listado paginado de clientes',
    })
    @ApiHeader({
        name: 'x-api-key',
        description: 'API Key de administrador.',
        required: true,
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
        return this.customersService.findAll(pagination)}

    @Get(':id')
    @UseGuards(AdminGuard)
    @ApiOperation({
        summary: 'Consultar cliente por ID',
    })
    @ApiParam({
        name: 'id',
        type: Number,
        example: 6,
    })
    @ApiHeader({
        name: 'x-api-key',
        description: 'API Key de administrador.',
        required: true,
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
        description: 'Acceso denegado.',
    })
    findOne(@Param('id', ParseIntPipe) id: number): Promise<CustomerResponseDto> {
        return this.customersService.findOne(id)}

    @Patch(':id')
    @UseGuards(AdminGuard)
    @ApiOperation({
        summary: 'Actualizar cliente por ID',
    })
    @ApiParam({
        name: 'id',
        type: Number,
        example: 6,
    })
    @ApiHeader({
        name: 'x-api-key',
        description: 'API Key de administrador.',
        required: true,
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
        description: 'Acceso denegado.',
    })
    update(@Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateCustomerDto): Promise<CustomerResponseDto> {
        return this.customersService.update(id, dto)}
}
