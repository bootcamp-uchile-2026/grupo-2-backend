import { Module } from '@nestjs/common';
import { EmprendedoresService } from './emprendedores.service';
import { EmprendedoresController } from './emprendedores.controller';
import { ProductosModule } from 'src/productos/productos.module';

@Module({
  providers: [EmprendedoresService, ProductosModule],
  controllers: [EmprendedoresController],
  imports:[ProductosModule]
})
export class EmprendedoresModule {}
