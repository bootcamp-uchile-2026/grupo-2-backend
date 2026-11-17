import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { UserEntity } from '../models/user.entity';
import { CustomerEntity } from '../models/customer.entity';
import { CartEntity } from '../models/cart.entity';
import { GreenPointMovementEntity } from '../models/green-point-movement.entity';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      CustomerEntity,
      CartEntity,
      GreenPointMovementEntity,
    ]),
    FilesModule,
  ],
  controllers: [CustomersController],
  providers: [CustomersService],
  exports: [CustomersService],
})
export class CustomersModule { }