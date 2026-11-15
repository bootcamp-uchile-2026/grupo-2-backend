import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from '../models/order.entity';
import { OrderItemEntity } from '../models/order-item.entity';
import { CustomersModule } from '../customers/customers.module';
import { ProductsModule } from '../products/products.module';
import { CartsModule } from '../carts/carts.module';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            OrderEntity,
            OrderItemEntity,
        ]),
        CustomersModule,
        ProductsModule,
        CartsModule,
    ],
    controllers: [OrdersController],
    providers: [OrdersService],
    exports: [OrdersService],
})
export class OrdersModule {}