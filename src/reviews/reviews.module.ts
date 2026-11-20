import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewEntity } from '../models/review.entity';
import { CustomersModule } from '../customers/customers.module';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ReviewEntity,
        ]),
        CustomersModule,
    ],
    controllers: [
        ReviewsController,
    ],
    providers: [
        ReviewsService,
    ],
})
export class ReviewsModule { }