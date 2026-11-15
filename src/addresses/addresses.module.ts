import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressEntity } from '../models/address.entity';
import { CustomersModule } from '../customers/customers.module';
import { AddressesController } from './addresses.controller';
import { AddressesService } from './addresses.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            AddressEntity,
        ]),
        CustomersModule,
    ],
    controllers: [AddressesController],
    providers: [AddressesService],
    exports: [AddressesService],
})
export class AddressesModule {}