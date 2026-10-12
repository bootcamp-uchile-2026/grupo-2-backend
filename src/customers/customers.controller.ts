import { Controller, Get, Post, Body, Patch, Param, Req, UseGuards, ParseIntPipe, } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { AdminGuard } from '../common/guards/admin-access/admin.guard';
import { CustomerAccessGuard } from 'src/common/guards/customer-access/customer-access.guard';
import { Request } from 'express';

interface CustomRequest extends Request {
  customerId: number;
}

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) { }


  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @Get()
  @UseGuards(AdminGuard)
  findAll() {
    return this.customersService.findAll();
  }

  @Get('me')
  @UseGuards(CustomerAccessGuard)
  findMyProfile(@Req() request: CustomRequest) {
    return this.customersService.findOne(request.customerId);
  }

  @Get(':id')
  @UseGuards(AdminGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.customersService.findOne(id);
  }

  @Patch('me')
  @UseGuards(CustomerAccessGuard)
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
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customersService.update(id, updateCustomerDto);
  }
}
