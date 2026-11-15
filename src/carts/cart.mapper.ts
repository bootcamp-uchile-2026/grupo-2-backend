import { CartEntity } from '../models/cart.entity';
import { CartItemEntity } from '../models/cart-item.entity';
import { CartItemResponseDto } from '../dto/cart-item-response.dto';
import { CartResponseDto } from '../dto/cart-response.dto';

export class CartMapper {

    static toItemResponseDto(item: CartItemEntity,
        activeOfferPrice: number | null,unitGreenPoints: number,
        primaryImageFileId: string | null,available: boolean): CartItemResponseDto {

        const product = item.product;
        const finalPrice = activeOfferPrice ?? product.price;

        const discountPercentage =activeOfferPrice === null  ? 0: Math.round(((product.price - activeOfferPrice)/ product.price) * 100);

        const unitCo2Avoided = Number(product.co2Avoided);

        return {
            productId: product.id,
            name: product.name,
            producerId: product.producerId,
            producerName: product.producer.businessName,
            primaryImageFileId,
            price: product.price,
            offerPrice: activeOfferPrice,
            finalPrice,
            discountPercentage,
            quantity: item.quantity,
            stock: product.stock,
            available,
            subtotal: finalPrice * item.quantity,
            unitCo2Avoided,
            unitGreenPoints,
            co2Avoided: Number(
                (unitCo2Avoided * item.quantity).toFixed(4),
            ),
            greenPoints: unitGreenPoints * item.quantity,
        };
    }

    static toResponseDto(cart: CartEntity, items: CartItemResponseDto[]): CartResponseDto {

        return {
            id: cart.id,
            customerId: cart.customerId,
            items,
            totalProducts: items.length,
            totalItems: items.reduce(
                (total, item) => total + item.quantity,
                0,
            ),
            subtotal: items.reduce(
                (total, item) => total + item.subtotal,
                0,
            ),
            totalDiscount: items.reduce(
                (total, item) =>
                    total + (item.price - item.finalPrice) * item.quantity,
                0,
            ),
            totalCo2Avoided: Number(
                items.reduce(
                    (total, item) => total + item.co2Avoided,
                    0,
                ).toFixed(4),
            ),
            totalGreenPoints: items.reduce(
                (total, item) => total + item.greenPoints,
                0,
            ),
            canCheckout:
                items.length > 0 &&
                items.every(item => item.available),
        };
    }
}