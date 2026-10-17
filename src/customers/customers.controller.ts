import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse, ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiHeader, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam,
  ApiTags
} from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { CustomerResponseDto } from '../dto/customer-response.dto';
import { AdminGuard } from '../common/guards/admin-access/admin.guard';

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
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @Get()
  @UseGuards(AdminGuard)
  @ApiOperation({
    summary: 'Obtener todos los clientes',
    description:
      'Consulta el listado de clientes. Requiere API Key de administrador.',
  })
  @ApiHeader({
    name: 'x-api-key',
    description: 'API Key de administrador.',
    required: true,
  })
  @ApiOkResponse({
    description: 'Listado de clientes obtenido correctamente.',
    type: CustomerResponseDto,
    isArray: true,
  })
  @ApiForbiddenResponse({
    description: 'Acceso denegado.',
  })
  findAll() {
    return this.customersService.findAll();
  }

  @Get(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({
    summary: 'Consultar cliente por ID',
    description: 'Consulta un cliente mediante su identificador numérico.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'Identificador del cliente.',
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
    description: 'El identificador debe ser un número entero.',
  })
  @ApiNotFoundResponse({
    description: 'Cliente no encontrado.',
  })
  @ApiForbiddenResponse({
    description: 'Acceso denegado.',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.customersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({
    summary: 'Actualizar cliente por ID',
    description:
      'Actualiza los datos de un cliente mediante su identificador.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'Identificador del cliente.',
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
    description: 'Identificador o datos de actualización inválidos.',
  })
  @ApiForbiddenResponse({
    description: 'Acceso denegado.',
  })
  @ApiNotFoundResponse({
    description: 'Cliente no encontrado.',
  })
  @ApiConflictResponse({
    description: 'El correo electrónico ya está registrado.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customersService.update(id, updateCustomerDto);
  }
}
