import { ProductEntity } from '../models/product.entity';
import { ProductSummaryDto } from '../dto/product-summary.dto';

export class ProductMapper {

    static toSummaryDto(product: ProductEntity, activeOfferPrice: number | null, greenPoints: number, rating: number | null, reviewCount: number, primaryImageFileId: string | null): ProductSummaryDto {

        const finalPrice = activeOfferPrice ?? product.price;

        const discountPercentage =
            activeOfferPrice === null
                ? 0
                : Math.round(
                    ((product.price - activeOfferPrice)
                        / product.price) * 100,
                );

        return {
            id: product.id,
            name: product.name,
            producerId: product.producerId,
            producerName: product.producer.businessName,
            categoryId: product.categoryId,
            price: product.price,
            offerPrice: activeOfferPrice,
            finalPrice,
            discountPercentage,
            stock: product.stock,
            available: product.isActive && product.stock > 0, co2Avoided: Number(product.co2Avoided),
            greenPoints,
            rating,
            reviewCount,
            primaryImageFileId,
        };
    }
}
