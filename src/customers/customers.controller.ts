import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiForbiddenResponse, ApiHeader, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { AdminGuard } from '../common/guards/admin-access/admin.guard';
import { CustomerAccessGuard } from '../common/guards/customer-access/customer-access.guard';

interface CustomRequest extends Request {
  customerId: number;
}

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
  })
  @ApiBadRequestResponse({
    description: 'Los datos del cliente no son válidos.',
  })
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @Get()
  @UseGuards(AdminGuard)
  @ApiOperation({
    summary: 'Obtener todos los clientes',
    description: 'Consulta el listado de clientes. Requiere API Key de administrador.',
  })
  @ApiHeader({
    name: 'x-api-key',
    description: 'API Key de administrador.',
    required: true,
  })
  @ApiOkResponse({
    description: 'Listado de clientes obtenido correctamente.',
  })
  @ApiForbiddenResponse({
    description: 'Acceso denegado.',
  })
  findAll() {
    return this.customersService.findAll();
  }

  @Get('me')
  @UseGuards(CustomerAccessGuard)
  @ApiOperation({
    summary: 'Consultar perfil del cliente',
    description:
      'Consulta el perfil asociado al identificador de cliente proporcionado en la solicitud.',
  })
  @ApiHeader({
    name: 'x-api-key',
    description: 'API Key de cliente.',
    required: true,
  })
  @ApiOkResponse({
    description: 'Perfil obtenido correctamente.',
  })
  @ApiForbiddenResponse({
    description: 'Acceso denegado.',
  })
  @ApiNotFoundResponse({
    description: 'Cliente no encontrado.',
  })
  findMyProfile(@Req() request: CustomRequest) {
    return this.customersService.findOne(request.customerId);
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

  @Patch('me')
  @UseGuards(CustomerAccessGuard)
  @ApiOperation({
    summary: 'Actualizar perfil del cliente',
    description:
      'Actualiza los datos del cliente asociado al identificador proporcionado en la solicitud.',
  })
  @ApiHeader({
    name: 'x-api-key',
    description: 'API Key de cliente.',
    required: true,
  })
  @ApiBody({ type: UpdateCustomerDto })
  @ApiOkResponse({
    description: 'Perfil actualizado correctamente.',
  })
  @ApiBadRequestResponse({
    description: 'Los datos proporcionados no son válidos.',
  })
  @ApiForbiddenResponse({
    description: 'Acceso denegado.',
  })
  @ApiNotFoundResponse({
    description: 'Cliente no encontrado.',
  })
  updateMyProfile(
    @Req() request: CustomRequest,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customersService.update(
      request.customerId,
      updateCustomerDto,
    );
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({
    summary: 'Actualizar cliente por ID',
    description: 'Actualiza los datos de un cliente mediante su identificador.',
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
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customersService.update(id, updateCustomerDto);
  }
}
