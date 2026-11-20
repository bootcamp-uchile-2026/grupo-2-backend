import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UserEntity, UserRole } from '../models/user.entity';
import { CustomerEntity } from '../models/customer.entity';
import { ProducerEntity } from '../models/producer.entity';
import { LoginDto } from '../dto/login.dto';
import { LoginResponseDto } from '../dto/login-response.dto';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>,

    @InjectRepository(ProducerEntity)
    private readonly producerRepository: Repository<ProducerEntity>,

    private readonly jwtService: JwtService) { }

  async login(dto: LoginDto): Promise<LoginResponseDto> {

    const email = dto.email.trim().toLowerCase();

    const user = await this.userRepository.findOne({
      where: { email }});

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const passwordIsValid = await argon2.verify(
      user.passwordHash,
      dto.password);

    if (!passwordIsValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    let customerId: number | null = null;
    let producerId: number | null = null;

    if (user.role === UserRole.CUSTOMER) {

      const customer = await this.customerRepository.findOne({
        where: {
          userId: user.id,
        },
      });

      if (!customer) {
        throw new UnauthorizedException('Credenciales inválidas');
      }

      customerId = customer.id;
    }

    if (user.role === UserRole.PRODUCER) {

      const producer = await this.producerRepository.findOne({
        where: {
          userId: user.id,
        },
      });

      if (!producer) {
        throw new UnauthorizedException('Credenciales inválidas');
      }

      producerId = producer.id;
    }

    const payload = {
      sub: user.id,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      access_token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        customerId,
        producerId,
      },
    };
  }
}