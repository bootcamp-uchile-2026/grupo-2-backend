import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './../model/customer.model';
import { CustomerNotFoundError } from '../common/errors/customer-not-found.error';

@Injectable()
export class CustomersService {

  private customers: Customer[] = [];
  private siguienteId = 1;

  create(createCustomerDto: CreateCustomerDto): Customer {

    const newCustomer = new Customer();

    newCustomer.email = createCustomerDto.email;
    newCustomer.password = createCustomerDto.password;

    newCustomer.id = this.siguienteId++;
    newCustomer.greenPoints = 0;
    newCustomer.addresses = [];
    newCustomer.paymentMethods = [];
    newCustomer.orders = [];

    this.customers.push(newCustomer);

    return newCustomer;
  }

  findAll() {

    const AllCustomers = this.customers.map(customer => {
      const { password, ...customerWithoutPassword } = customer;

      return customerWithoutPassword;

    });

    return AllCustomers;

  }

  findOne(id: number) {

    const customer = this.customers.find(c => c.id === id);

    if (!customer) {
      throw new CustomerNotFoundError();
    }
    const { password, ...customerWithoutPassword } = customer;

    return customerWithoutPassword;

  }


  update(id: number, updateCustomerDto: UpdateCustomerDto) {

    const customer = this.customers.find(c => c.id === id);
    if (!customer) {
      throw new CustomerNotFoundError();
    }
    Object.assign(customer, updateCustomerDto);
    const { password, ...customerWithoutPassword } = customer;

    return customerWithoutPassword;
  }

}
