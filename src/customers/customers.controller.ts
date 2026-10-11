import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

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
  //

  @Get()
  findAll() {
    return this.customersService.findAll();
  }

  //
  //Consultar un cliente por su ID
  //

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(+id);
  }

  ////////////////////////////////////
  // Modificar un cliente por su ID //
  ////////////////////////////////////

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customersService.update(+id, updateCustomerDto);
  }

}
