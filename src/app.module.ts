import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { ProducersModule } from './producers/producers.module';
import { CustomersModule } from './customers/customers.module';
import { ArticlesModule } from './articles/articles.module';
import { FavoritesModule } from './favorites/favorites.module';
import { RequestTracingMiddleware } from './common/middleware/request-tracing.middleware';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from './models/file.entity';
import { UserEntity } from './models/user.entity';
import { CustomerEntity } from './models/customer.entity';
import { SustainabilityAttributeEntity } from './models/sustainability-attribute.entity';
import { CartEntity } from './models/cart.entity';
import { CartItemEntity } from './models/cart-item.entity';
import { AddressEntity } from './models/address.entity';
import { OrderEntity } from './models/order.entity';
import { ReturnItemEntity } from './models/return-item.entity';
import { FavoriteEntity } from './models/favorite.entity';
import { GreenPointMovementEntity } from './models/green-point-movement.entity';
import { ReturnEntity } from './models/return.entity';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: false,
    }), TypeOrmModule.forFeature([
      FileEntity,
      UserEntity,
      CustomerEntity,
      SustainabilityAttributeEntity,
      CartEntity,
      CartItemEntity,
      AddressEntity,
      OrderEntity,
      ReturnItemEntity,
      FavoriteEntity,
      GreenPointMovementEntity,
      ReturnEntity
    ]),
    FavoritesModule,
    CategoriesModule,
    ProductsModule,
    ProducersModule,
    CustomersModule,
    ArticlesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestTracingMiddleware)
      .forRoutes('*');
  }
}
