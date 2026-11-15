import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersModule } from '../customers/customers.module';
import { ProductsModule } from '../products/products.module';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { FavoriteEntity } from '../models/favorite.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([FavoriteEntity]),
        CustomersModule,
        ProductsModule,
    ],
    controllers: [FavoritesController],
    providers: [FavoritesService],
})
export class FavoritesModule {}
