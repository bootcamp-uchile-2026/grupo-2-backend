import { Module } from '@nestjs/common';
import { ProductosModule } from '../productos/productos.module';
import { SubcategoriasController } from './subcategorias.controller';
import { SubcategoriasService } from './subcategorias.service';

@Module({
  imports: [ProductosModule],
  controllers: [SubcategoriasController],
  providers: [SubcategoriasService],
})
export class SubcategoriasModule {}