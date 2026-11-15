import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { ProducersModule } from './producers/producers.module';
import { CustomersModule } from './customers/customers.module';
import { ArticlesModule } from './articles/articles.module';
import { FavoritesModule } from './favorites/favorites.module';
import { CartsModule } from './carts/carts.module';
import { AddressesModule } from './addresses/addresses.module';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';
import { RequestTracingMiddleware } from './common/middleware/request-tracing.middleware';
import { FileEntity } from './models/file.entity';
import { SustainabilityAttributeEntity } from './models/sustainability-attribute.entity';
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
    }),
    TypeOrmModule.forFeature([
      FileEntity,
      SustainabilityAttributeEntity,
      ReturnEntity,
    ]),
    FavoritesModule,
    CategoriesModule,
    ProductsModule,
    ProducersModule,
    CustomersModule,
    ArticlesModule,
    CartsModule,
    AddressesModule,
    AuthModule,
    OrdersModule,
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