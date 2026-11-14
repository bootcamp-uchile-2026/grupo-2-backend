import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { EntrepreneursModule } from './entrepreneurs/entrepreneurs.module';
import { CustomersModule } from './customers/customers.module';
import { ArticlesModule } from './articles/articles.module';
import { FavoritesModule } from './favorites/favorites.module';
import { RequestTracingMiddleware } from './common/middleware/request-tracing.middleware';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from './models/file.entity';
import { UserEntity } from './models/user.entity';
import { CustomerEntity } from './models/customer.entity';
import { ProducerEntity } from './models/producer.entity';
import { CategoryEntity } from './models/category.entity';
import { ProductEntity } from './models/product.entity';
import { ProductImageEntity } from './models/product-image.entity';
import { SustainabilityAttributeEntity } from './models/sustainability-attribute.entity';
import { ProductSustainabilityAttributeEntity } from './models/product-sustainability-attribute.entity';
import { FoodDetailEntity } from './models/food-detail.entity';
import { PersonalCareDetailEntity } from './models/personal-care-detail.entity';
import { GardenDetailEntity } from './models/garden-detail.entity';
import { HomeCleaningDetailEntity } from './models/home-cleaning-detail.entity';
import { WellnessDetailEntity } from './models/wellness-detail.entity';
import { ClothingDetailEntity } from './models/clothing-detail.entity';
import { PetDetailEntity } from './models/pet-detail.entity';
import { CraftDetailEntity } from './models/craft-detail.entity';
import { CartEntity } from './models/cart.entity';
import { CartItemEntity } from './models/cart-item.entity';
import { AddressEntity } from './models/address.entity';
import { OrderEntity } from './models/order.entity';
import { OrderItemEntity } from './models/order-item.entity';
import { ReturnEntity } from './models/return.entity';
import { ReturnItemEntity } from './models/return-item.entity';
import { ReviewEntity } from './models/review.entity';
import { FavoriteEntity } from './models/favorite.entity';
import { GreenPointMovementEntity } from './models/green-point-movement.entity';
import { ArticleEntity } from './models/article.entity';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: false,
    }), TypeOrmModule.forFeature([
      FileEntity,
      UserEntity,
      CustomerEntity,
      ProducerEntity,
      CategoryEntity,
      ProductEntity,
      ProductImageEntity,
      SustainabilityAttributeEntity,
      ProductSustainabilityAttributeEntity,
      FoodDetailEntity,
      PersonalCareDetailEntity,
      GardenDetailEntity,
      HomeCleaningDetailEntity,
      WellnessDetailEntity,
      ClothingDetailEntity,
      PetDetailEntity,
      CraftDetailEntity,
      CartEntity,
      CartItemEntity,
      AddressEntity,
      OrderEntity,
      OrderItemEntity,
      ReturnEntity,
      ReturnItemEntity,
      ReviewEntity,
      FavoriteEntity,
      GreenPointMovementEntity,
      ArticleEntity,
    ]),
    FavoritesModule,
    CategoriesModule,
    ProductsModule,
    EntrepreneursModule,
    CustomersModule,
    ArticlesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestTracingMiddleware)
      .forRoutes('*');
  }
}
