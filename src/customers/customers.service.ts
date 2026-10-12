import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { CustomerResponseDto } from '../dto/customer-response.dto';
import { Customer } from '../models/customer.model';
import { CustomerNotFoundError } from '../common/errors/customer-not-found.error';

@Injectable()
export class CustomersService {

  private readonly customers: Customer[] = [];
  private nextId = 1;

  private toResponse(customer: Customer): CustomerResponseDto {
    const { password, ...customerWithoutPassword } = customer;
    return customerWithoutPassword;
  }

  create(createCustomerDto: CreateCustomerDto): CustomerResponseDto {
    const newCustomer = new Customer();

    newCustomer.id = this.nextId++;
    newCustomer.email = createCustomerDto.email;
    newCustomer.password = createCustomerDto.password;
    newCustomer.greenPoints = 0;
    newCustomer.addresses = [];
    newCustomer.paymentMethods = [];
    newCustomer.orders = [];

    this.customers.push(newCustomer);

    return this.toResponse(newCustomer);
  }

  findAll(): CustomerResponseDto[] {
    return this.customers.map((customer) => this.toResponse(customer));
  }

  findOne(id: number): CustomerResponseDto {
    const customer = this.customers.find((customer) => customer.id === id);

    if (!customer) {
      throw new CustomerNotFoundError();
    }

    return this.toResponse(customer);
  }

  update(id: number,updateCustomerDto: UpdateCustomerDto): CustomerResponseDto {
    const customer = this.customers.find((customer) => customer.id === id);

    if (!customer) {
      throw new CustomerNotFoundError();
    }

    Object.assign(customer, updateCustomerDto);

    return this.toResponse(customer);
  }
}
