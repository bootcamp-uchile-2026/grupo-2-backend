import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProducerEntity } from '../models/producer.entity';
import { ProducersController }from './producers.controller';
import { ProducersService } from './producers.service';
import { ProductsModule }from '../products/products.module';
import { CategoriesModule } from '../categories/categories.module';
import { CategoryExistsPipe } from '../common/pipes/category-exists.pipe';

@Module({
    imports: [
        TypeOrmModule.forFeature([ProducerEntity]),
        ProductsModule,
        CategoriesModule,
    ],
    controllers: [
        ProducersController,
    ],
    providers: [
        ProducersService,
        CategoryExistsPipe,
    ],
    exports: [
        ProducersService,
    ],
})
export class ProducersModule { }