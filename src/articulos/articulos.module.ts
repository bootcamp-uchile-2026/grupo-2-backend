import { Module } from '@nestjs/common';
import { ArticlesController } from './articulos.controller';
import { ArticlesService } from './articulos.service';

@Module({
  controllers: [ArticlesController],
  providers: [ArticlesService],
})
export class ArticlesModule {}
