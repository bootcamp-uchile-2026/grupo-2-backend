import { Module } from '@nestjs/common';
import { SubcategoriasModule } from './subcategorias/subcategorias.module';
import { ProductosModule } from './productos/productos.module';
import { EmprendedoresModule } from './emprendedores/emprendedores.module';

@Module({
  imports: [SubcategoriasModule, ProductosModule, EmprendedoresModule]
})
export class AppModule {}