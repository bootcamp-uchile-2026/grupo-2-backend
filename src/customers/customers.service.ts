import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './../model/customer.model';

@Injectable()
export class CustomersService {

  private customers: Customer[] = [];
  private siguienteId = 1;

  ////////////////////////////
  // Crear un nuevo cliente //
  ////////////////////////////

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

  ////////////////////////
  // Consultar clientes //
  ////////////////////////
  
  //
  //Consultar todos los clientes
  //

  findAll() {

    const AllCustomers = this.customers.map(customer => {

      //Se crea un nuevo objeto sin la propiedad password
      const { password, ...customerWithoutPassword } = customer;
      
      return customerWithoutPassword;
    
    });
    
    return AllCustomers;
  
  }

  //
  //Consultar un cliente por su ID  
  //

  findOne(id: number) {

    const customer = this.customers.find(c => c.id === id);
    
    if (!customer) {

      return `Customer with ID ${id} not found`;
    
    }

    //Se crea un nuevo objeto sin la propiedad password
    const { password, ...customerWithoutPassword } = customer;
    
    return customerWithoutPassword;
  
  }

  ////////////////////////////////////
  // Modificar un cliente por su ID //
  ////////////////////////////////////

  update(id: number, updateCustomerDto: UpdateCustomerDto) {

    const customer = this.customers.find(c => c.id === id);
    if (!customer) {
    throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    Object.assign(customer, updateCustomerDto);

    //Se crea un nuevo objeto sin la propiedad password
    const { password, ...customerWithoutPassword } = customer; 
    
    return customerWithoutPassword;
  }

}
