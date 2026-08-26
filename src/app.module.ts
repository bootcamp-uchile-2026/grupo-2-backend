import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SubcategoriasModule } from './subcategorias/subcategorias.module';
import { ProductosModule } from './productos/productos.module';

@Module({
  imports: [SubcategoriasModule, ProductosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}