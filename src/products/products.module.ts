import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductEntity } from '../models/product.entity';
import { ProductImageEntity } from '../models/product-image.entity';
import { ReviewEntity } from '../models/review.entity';
import { OrderItemEntity } from '../models/order-item.entity';
import { ReturnItemEntity } from '../models/return-item.entity';
import { ProductSustainabilityAttributeEntity } from '../models/product-sustainability-attribute.entity';
import { FoodDetailEntity } from '../models/food-detail.entity';
import { PersonalCareDetailEntity } from '../models/personal-care-detail.entity';
import { GardenDetailEntity } from '../models/garden-detail.entity';
import { HomeCleaningDetailEntity } from '../models/home-cleaning-detail.entity';
import { WellnessDetailEntity } from '../models/wellness-detail.entity';
import { ClothingDetailEntity } from '../models/clothing-detail.entity';
import { PetDetailEntity } from '../models/pet-detail.entity';
import { CraftDetailEntity } from '../models/craft-detail.entity';
import { FilesModule } from '../files/files.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ProductEntity,
            ProductImageEntity,
            ReviewEntity,
            OrderItemEntity,
            ReturnItemEntity,
            ProductSustainabilityAttributeEntity,
            FoodDetailEntity,
            PersonalCareDetailEntity,
            GardenDetailEntity,
            HomeCleaningDetailEntity,
            WellnessDetailEntity,
            ClothingDetailEntity,
            PetDetailEntity,
            CraftDetailEntity,
        ]),
        FilesModule,
    ],
    controllers: [ProductsController],
    providers: [ProductsService],
    exports: [ProductsService],
})
export class ProductsModule { }