import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SubcategoriasModule } from './subcategorias/subcategorias.module';
import { ProductosModule } from './productos/productos.module';
import { EmprendedoresModule } from './emprendedores/emprendedores.module';
import { RequestTracingMiddleware } from './middleware/request-tracing/request-tracing.middleware';

@Module({
  imports: [SubcategoriasModule, ProductosModule, EmprendedoresModule]
})
export class AppModule implements NestModule {

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestTracingMiddleware)
      .forRoutes('*');
  }

}