import { ApiProperty } from '@nestjs/swagger';
import { CheckoutItemResponseDto } from './checkout-item-response.dto';

export class CheckoutPreviewResponseDto {

    @ApiProperty({ example: 6 })
    customerId: number;

    @ApiProperty({ example: 11 })
    addressId: number;

    @ApiProperty({ type: [CheckoutItemResponseDto] })
    items: CheckoutItemResponseDto[];

    @ApiProperty({
        description: 'Cantidad de productos diferentes.',
        example: 2,
    })
    totalProducts: number;

    @ApiProperty({
        description: 'Cantidad total de unidades.',
        example: 3,
    })
    totalItems: number;

    @ApiProperty({ example: 20000 })
    subtotal: number;

    @ApiProperty({ example: 2990 })
    shippingCost: number;

    @ApiProperty({
        description: 'Saldo actual de puntos verdes del cliente.',
        example: 751,
    })
    availableGreenPoints: number;

    @ApiProperty({
        description: 'Cantidad máxima de puntos verdes que puede utilizar.',
        example: 751,
    })
    maxGreenPointsToRedeem: number;

    @ApiProperty({ example: 500 })
    greenPointsRedeemed: number;

    @ApiProperty({
        description: 'Saldo estimado después del canje.',
        example: 251,
    })
    remainingGreenPoints: number;

    @ApiProperty({
        description: 'Puntos verdes que se obtendrán al recibir el pedido.',
        example: 500,
    })
    estimatedGreenPoints: number;

    @ApiProperty({
        description: 'Kilogramos de CO2 equivalente que se evitarán.',
        example: 5,
    })
    estimatedCo2Avoided: number;

    @ApiProperty({
        description: 'Total a pagar, incluyendo despacho y descuentos.',
        example: 22490,
    })
    total: number;
}