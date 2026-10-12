import { Module } from '@nestjs/common';
import { EmprendedoresService } from './emprendedores.service';
import { EmprendedoresController } from './emprendedores.controller';
import { ProductosModule } from 'src/productos/productos.module';

@Module({
  imports: [ProductosModule],
  controllers: [EmprendedoresController],
  providers: [EmprendedoresService],
})
export class EmprendedoresModule {}
