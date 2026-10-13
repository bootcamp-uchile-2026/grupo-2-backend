import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { CustomerResponseDto } from '../dto/customer-response.dto';
import { Customer } from '../models/customer.model';
import { CustomerNotFoundError } from '../common/errors/customer-not-found.error';
import { DuplicateEmailError } from 'src/common/errors/duplicate-email.error';

@Injectable()
export class CustomersService {

  private readonly customers: Customer[] = [];
  private nextId = 1;

  private toResponse(customer: Customer): CustomerResponseDto {
    return {
      id: customer.id,
      email: customer.email,
      greenPoints: customer.greenPoints,
    };
  }

  create(createCustomerDto: CreateCustomerDto): CustomerResponseDto {
    const existingCustomer = this.customers.find(
      (customer) =>
        customer.email.toLowerCase() === createCustomerDto.email.toLowerCase(),
    );

    if (existingCustomer) {
      throw new DuplicateEmailError();
    }
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

  update(id: number, updateCustomerDto: UpdateCustomerDto): CustomerResponseDto {
    const customer = this.customers.find((customer) => customer.id === id);

    if (!customer) {
      throw new CustomerNotFoundError();
    }

    if (updateCustomerDto.email) {
      const existingCustomer = this.customers.find(
        (otherCustomer) =>
          otherCustomer.email.toLowerCase() ===
          updateCustomerDto.email!.toLowerCase() &&
          otherCustomer.id !== id,
      );

      if (existingCustomer) {
        throw new DuplicateEmailError();
      }
    }

    Object.assign(customer, updateCustomerDto);

    return this.toResponse(customer);
  }
}
