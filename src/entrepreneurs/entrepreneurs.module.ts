import { Module } from '@nestjs/common';
import { EntrepreneursService } from './entrepreneurs.service';
import { EntrepreneursController } from './entrepreneurs.controller';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [ProductsModule],
  controllers: [EntrepreneursController],
  providers: [EntrepreneursService],
})
export class EntrepreneursModule { }
