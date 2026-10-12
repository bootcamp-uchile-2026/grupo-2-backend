import { Module } from '@nestjs/common';
import { ProductsModule } from '../productos/productos.module';
import { SubcategoriesController } from './subcategorias.controller';
import { SubcategoriesService } from './subcategorias.service';

@Module({
  imports: [ProductsModule],
  controllers: [SubcategoriesController],
  providers: [SubcategoriesService],
})
export class SubcategoriesModule {}