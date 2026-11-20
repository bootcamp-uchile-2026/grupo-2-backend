import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReturnEntity } from '../models/return.entity';
import { ReturnItemEntity } from '../models/return-item.entity';
import { CustomersModule } from '../customers/customers.module';
import { ReturnsService } from './returns.service';
import { CustomerReturnsController } from './customer-returns.controller';
import { AdminReturnsController } from './admin-returns.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ReturnEntity,
            ReturnItemEntity,
        ]),
        CustomersModule,
    ],
    controllers: [
        CustomerReturnsController,
        AdminReturnsController,
    ],
    providers: [
        ReturnsService,
    ],
})
export class ReturnsModule { }