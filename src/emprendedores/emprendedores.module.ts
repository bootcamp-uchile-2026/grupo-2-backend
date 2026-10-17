import { Module } from '@nestjs/common';
import { EntrepreneursService } from './emprendedores.service';
import { EntrepreneursController } from './emprendedores.controller';
import { ProductsModule } from '../productos/productos.module';

@Module({
  imports: [ProductsModule],
  controllers: [EntrepreneursController],
  providers: [EntrepreneursService],
})
export class EntrepreneursModule {}
