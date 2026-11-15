import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProducerEntity } from '../models/producer.entity';
import { ProducersController } from './producers.controller';
import { ProducersService } from './producers.service';
import { ProductsModule } from '../products/products.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([ProducerEntity]),
        ProductsModule,
    ],
    controllers: [ProducersController],
    providers: [ProducersService],
    exports: [ProducersService],
})
export class ProducersModule { }
