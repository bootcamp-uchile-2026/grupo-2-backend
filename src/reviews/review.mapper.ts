import { ReviewEntity } from '../models/review.entity';
import { CustomerReviewDto } from '../dto/customer-review.dto';

export class ReviewMapper {

    static toResponseDto(review: ReviewEntity): CustomerReviewDto {

        return {
            id: review.id,
            customerId: review.customerId,
            productId: review.productId,
            productName: review.product.name,
            rating: review.rating,
            comment: review.comment,
            createdAt: review.createdAt,
            updatedAt: review.updatedAt,
        };
    }
}