import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SubcategoriasModule } from './subcategorias/subcategorias.module';
import { ProductosModule } from './productos/productos.module';
import { EmprendedoresModule } from './emprendedores/emprendedores.module';
import { CustomersModule } from './customers/customers.module';

@Module({
  imports: [SubcategoriasModule, ProductosModule, EmprendedoresModule, CustomersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}