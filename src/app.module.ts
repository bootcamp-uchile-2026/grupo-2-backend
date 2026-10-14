import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './productos/productos.module';
import { EntrepreneursModule } from './emprendedores/emprendedores.module';
import { CustomersModule } from './customers/customers.module';
import { ArticlesModule } from './articulos/articulos.module';
import { FavoritesModule } from './favorites/favorites.module';
import { RequestTracingMiddleware } from './common/middleware/request-tracing.middleware';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    FavoritesModule,
    CategoriesModule,
    ProductsModule,
    EntrepreneursModule,
    CustomersModule,
    ArticlesModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
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