import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SubcategoriasModule } from './subcategorias/subcategorias.module';

@Module({
  imports: [SubcategoriasModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}