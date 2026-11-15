import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { UserEntity, UserRole } from '../models/user.entity';
import { CustomerEntity } from '../models/customer.entity';
import { CartEntity } from '../models/cart.entity';
import { GreenPointMovementEntity, GreenPointMovementType } from '../models/green-point-movement.entity';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { CustomerResponseDto } from '../dto/customer-response.dto';
import { PaginationDto } from '../dto/pagination.dto';
import { CustomerNotFoundError } from '../common/errors/customer-not-found.error';
import { DuplicateEmailError } from '../common/errors/duplicate-email.error';
import { CustomerMapper } from './customer.mapper';

@Injectable()
export class CustomersService {

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>,

    @InjectRepository(GreenPointMovementEntity)
    private readonly greenPointRepository: Repository<GreenPointMovementEntity>,

    private readonly dataSource: DataSource) { }

  async create(dto: CreateCustomerDto): Promise<CustomerResponseDto> {

    const email = dto.email.trim().toLowerCase();
    const firstName = dto.firstName.trim();

    if (!firstName) {
      throw new BadRequestException('El nombre del cliente es obligatorio.');
    }

    if (dto.privacyAccepted !== true) {
      throw new BadRequestException('Debe aceptar la política de privacidad.');
    }

    await this.validateEmail(email);

    const passwordHash = await argon2.hash(dto.password, {
      type: argon2.argon2id,
    });

    return this.dataSource.transaction(async manager => {

      const user = manager.create(UserEntity, {
        email,
        passwordHash,
        firstName,
        lastName: dto.lastName?.trim() || null,
        phone: dto.phone?.trim() || null,
        profileFileId: null,
        role: UserRole.CUSTOMER,
        isActive: true,
        privacyAcceptedAt: new Date(),
      });

      const savedUser = await manager.save(user);

      const customer = manager.create(CustomerEntity, {
        userId: savedUser.id,
      });

      const savedCustomer = await manager.save(customer);

      const cart = manager.create(CartEntity, {
        customerId: savedCustomer.id,
      });

      await manager.save(cart);

      const welcomeMovement = manager.create(GreenPointMovementEntity, {
        customerId: savedCustomer.id,
        type: GreenPointMovementType.WELCOME,
        points: 80,
        orderId: null,
        returnId: null,
        reviewId: null,
        description: 'Puntos verdes de bienvenida',
      });

      await manager.save(welcomeMovement);

      savedCustomer.user = savedUser;

      return CustomerMapper.toResponseDto(savedCustomer, 80);
    });
  }

  async findAll(pagination: PaginationDto) {

    const { page, size, sortBy, sortDirection } = pagination;

    const allowedSortFields = [
      'id', 'firstName', 'lastName',
      'email', 'createdAt', 'isActive',
    ];

    if (!allowedSortFields.includes(sortBy)) {
      throw new BadRequestException('Campo de ordenamiento inválido.');
    }

    let sortField = `user.${sortBy}`;

    if (sortBy === 'id' || sortBy === 'createdAt') {
      sortField = `customer.${sortBy}`;
    }

    const query = this.customerRepository
      .createQueryBuilder('customer')
      .innerJoinAndSelect('customer.user', 'user')
      .where('user.role = :role', { role: UserRole.CUSTOMER });

    const totalElements = await query.getCount();

    query.orderBy(sortField, sortDirection);

    if (sortBy !== 'id') {
      query.addOrderBy('customer.id', 'ASC');
    }

    const customers = await query
      .skip(page * size)
      .take(size)
      .getMany();

    const points = await this.getGreenPoints(
      customers.map(customer => customer.id),
    );

    return {
      content: customers.map(customer =>
        CustomerMapper.toResponseDto(
          customer,
          points.get(customer.id) ?? 0,
        ),
      ),
      page,
      size,
      totalElements,
      totalPages: Math.ceil(totalElements / size),
      sortBy,
      sortDirection,
    };
  }

  async findOne(customerId: number): Promise<CustomerResponseDto> {

    const customer = await this.findCustomer(customerId);
    const points = await this.getGreenPoints([customer.id]);

    return CustomerMapper.toResponseDto(
      customer,
      points.get(customer.id) ?? 0,
    );
  }


  async validateOwnership(customerId: number, userId: number,requireActive: boolean = false): Promise<void> {
    const customer = await this.findCustomer(customerId);

    if (customer.userId !== userId) {
      throw new ForbiddenException(
        'No tienes permisos para acceder a este perfil.',
      );
    }

    if (requireActive && !customer.user.isActive) {
      throw new ForbiddenException(
        'El cliente se encuentra inactivo.',
      );
    }
  }

  async update(customerId: number, dto: UpdateCustomerDto): Promise<CustomerResponseDto> {

    const customer = await this.findCustomer(customerId);
    const user = customer.user;

    if (dto.email !== undefined) {
      const email = dto.email.trim().toLowerCase();

      await this.validateEmail(email, user.id);

      user.email = email;
    }

    if (dto.firstName !== undefined) {
      const firstName = dto.firstName.trim();

      if (!firstName) {
        throw new BadRequestException('El nombre del cliente es obligatorio.');
      }

      user.firstName = firstName;
    }

    if (dto.lastName !== undefined) {
      user.lastName = dto.lastName?.trim() || null;
    }

    if (dto.phone !== undefined) {
      user.phone = dto.phone?.trim() || null;
    }

    if (dto.password !== undefined) {
      user.passwordHash = await argon2.hash(dto.password, {
        type: argon2.argon2id,
      });
    }

    user.updatedAt = new Date();

    customer.user = await this.userRepository.save(user);

    const points = await this.getGreenPoints([customer.id]);

    return CustomerMapper.toResponseDto(
      customer,
      points.get(customer.id) ?? 0,
    );
  }

  private async findCustomer(customerId: number): Promise<CustomerEntity> {

    if (!Number.isInteger(customerId) || customerId <= 0) {
      throw new BadRequestException(
        'El identificador debe ser un número entero positivo.',
      );
    }

    const customer = await this.customerRepository.findOne({
      where: {
        id: customerId,
        user: {
          role: UserRole.CUSTOMER,
        },
      },
      relations: {
        user: true,
      },
    });

    if (!customer) {
      throw new CustomerNotFoundError();
    }

    return customer;
  }

  private async validateEmail(email: string, userId?: number): Promise<void> {

    const existingUser = await this.userRepository
      .createQueryBuilder('user')
      .where('LOWER(user.email) = :email', { email })
      .getOne();

    if (existingUser && existingUser.id !== userId) {
      throw new DuplicateEmailError();
    }
  }

  private async getGreenPoints(customerIds: number[]): Promise<Map<number, number>> {

    if (customerIds.length === 0) {
      return new Map();
    }

    const results = await this.greenPointRepository
      .createQueryBuilder('movement')
      .select('movement.customerId', 'customerId')
      .addSelect('SUM(movement.points)', 'greenPoints')
      .where('movement.customerId IN (:...customerIds)', { customerIds })
      .groupBy('movement.customerId')
      .getRawMany();

    return new Map<number, number>(
      results.map(result => [
        Number(result.customerId),
        Number(result.greenPoints),
      ]),
    );
  }
}
