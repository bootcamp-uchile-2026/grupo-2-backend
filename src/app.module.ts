import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SubcategoriesModule } from './subcategorias/subcategorias.module';
import { ProductsModule } from './productos/productos.module';
import { EntrepreneursModule } from './emprendedores/emprendedores.module';
import { CustomersModule } from './customers/customers.module';
import { RequestTracingMiddleware } from './common/middleware/request-tracing.middleware';

@Module({
  imports: [
    SubcategoriesModule,
    ProductsModule,
    EntrepreneursModule,
    CustomersModule,
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