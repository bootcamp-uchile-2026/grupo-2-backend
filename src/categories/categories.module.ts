import { Module } from '@nestjs/common';
import { ProductsModule } from '../productos/productos.module';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { SubcategoriesController } from './subcategories.controller';
import { SubcategoriesService } from './subcategories.service';

@Module({
  imports: [ProductsModule],
  controllers: [CategoriesController, SubcategoriesController],
  providers: [CategoriesService, SubcategoriesService],
  exports: [CategoriesService, SubcategoriesService],
})
export class CategoriesModule { }