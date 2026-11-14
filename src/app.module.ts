import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { EntrepreneursModule } from './entrepreneurs/entrepreneurs.module';
import { CustomersModule } from './customers/customers.module';
import { ArticlesModule } from './articles/articles.module';
import { FavoritesModule } from './favorites/favorites.module';
import { RequestTracingMiddleware } from './common/middleware/request-tracing.middleware';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

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
    FavoritesModule,
    CategoriesModule,
    ProductsModule,
    EntrepreneursModule,
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
