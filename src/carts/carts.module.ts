import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartEntity } from '../models/cart.entity';
import { CartItemEntity } from '../models/cart-item.entity';
import { ProductImageEntity } from '../models/product-image.entity';
import { CustomersModule } from '../customers/customers.module';
import { ProductsModule } from '../products/products.module';
import { CartsController } from './carts.controller';
import { CartsService } from './carts.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            CartEntity,
            CartItemEntity,
            ProductImageEntity,
        ]),
        CustomersModule,
        ProductsModule,
    ],
    controllers: [CartsController],
    providers: [CartsService],
    exports: [CartsService],
})
export class CartsModule {}