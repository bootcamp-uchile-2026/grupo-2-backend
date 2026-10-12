import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { UseGuards } from '@nestjs/common';
import { AdminGuard } from '../common/guards/admin-access/admin.guard';
import { CustomerAccessGuard } from 'src/common/guards/customer-access/customer-access.guard';
import { Request } from 'express';

interface CustomRequest extends Request {
  customerId: number;
}

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) { }

  ////////////////////////////
  // Crear un nuevo cliente //
  ////////////////////////////

  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  ////////////////////////
  // Consultar clientes //
  ////////////////////////

  //
  //Consultar todos los clientes 
  //(Solo administradores pueden acceder a esta ruta)
  //

  @Get()
  @UseGuards(AdminGuard)
  findAll() {
    return this.customersService.findAll();
  }

  //
  //Consultar un cliente por su ID
  //(Solo administradores pueden acceder a esta ruta)
  //

  @Get(':id')
  @UseGuards(AdminGuard)
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(+id);
  }

  //
  //Consultar un cliente por su ID
  //(Solo clientes pueden acceder a esta ruta)
  //

  @Get('me')
  @UseGuards(CustomerAccessGuard)
  findMyProfile(@Req() request: CustomRequest) {
    return this.customersService.findOne(request.customerId);
  }

  ////////////////////////////////////
  // Modificar un cliente por su ID //
  ////////////////////////////////////

  //
  //(Solo administradores pueden acceder a esta ruta)
  //

  @Patch(':id')
  @UseGuards(AdminGuard)
  update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customersService.update(+id, updateCustomerDto);
  }

  //
  //(Solo clientes pueden acceder a esta ruta)
  //

  /////////////
  // Revisar //
  /////////////

  @Patch('me')
  @UseGuards(CustomerAccessGuard)
  updateMyProfile(@Req() request: CustomRequest, @Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customersService.update(request.customerId, updateCustomerDto);
  }
}
