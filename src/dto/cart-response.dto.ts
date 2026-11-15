import { ApiProperty } from '@nestjs/swagger';
import { CartItemResponseDto } from './cart-item-response.dto';

export class CartResponseDto {

    @ApiProperty({ example: 6 })
    id: number;

    @ApiProperty({ example: 6 })
    customerId: number;

    @ApiProperty({ type: [CartItemResponseDto] })
    items: CartItemResponseDto[];

    @ApiProperty({
        description: 'Cantidad de productos diferentes en el carrito.',
        example: 1 })
    totalProducts: number;

    @ApiProperty({
        description: 'Cantidad total de unidades en el carrito.',
        example: 2})
    totalItems: number;

    @ApiProperty({ example: 9000 })
    subtotal: number;

    @ApiProperty({ example: 1000 })
    totalDiscount: number;

    @ApiProperty({ example: 6.1 })
    totalCo2Avoided: number;

    @ApiProperty({ example: 610 })
    totalGreenPoints: number;

    @ApiProperty({
        description: 'Indica si el carrito contiene productos y todos están disponibles.',
        example: true})
    canCheckout: boolean;
}