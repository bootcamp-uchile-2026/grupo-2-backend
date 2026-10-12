import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SubcategoriasModule } from './subcategorias/subcategorias.module';
import { ProductosModule } from './productos/productos.module';
import { EmprendedoresModule } from './emprendedores/emprendedores.module';
import { CustomersModule } from './customers/customers.module';

@Module({
  imports: [SubcategoriasModule, ProductosModule, EmprendedoresModule, CustomersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestTracingMiddleware)
      .forRoutes('*');
  }

}