import { Module } from '@nestjs/common';
import { ProductsController } from './productos.controller';
import { ProductsService } from './productos.service';

@Module({
    controllers: [ProductsController],
    providers: [ProductsService],
    exports:[ProductsService]
})
export class ProductsModule {}
