import { ApiProperty } from '@nestjs/swagger';

export class CheckoutItemResponseDto {

    @ApiProperty({ example: 65 })
    productId: number;

    @ApiProperty({ example: 'Miel de Ulmo Artesanal 500 g' })
    productName: string;

    @ApiProperty({ example: 12 })
    producerId: number;

    @ApiProperty({ example: 'Sabores de la Tierra' })
    producerName: string;

    @ApiProperty({
        type: String,
        nullable: true,
        example: null,
    })
    primaryImageFileId: string | null;

    @ApiProperty({ example: 2 })
    quantity: number;

    @ApiProperty({
        description: 'Precio unitario vigente, considerando ofertas.',
        example: 6291,
    })
    unitPrice: number;

    @ApiProperty({ example: 12582 })
    subtotal: number;

    @ApiProperty({
        description: 'Descuento asignado por canje de puntos verdes.',
        example: 300,
    })
    greenPointDiscount: number;

    @ApiProperty({
        description: 'Subtotal menos descuento por puntos verdes.',
        example: 12282,
    })
    total: number;

    @ApiProperty({ example: 3.0562 })
    unitCo2Avoided: number;

    @ApiProperty({ example: 305 })
    unitGreenPoints: number;

    @ApiProperty({ example: 6.1124 })
    co2Avoided: number;

    @ApiProperty({ example: 610 })
    greenPoints: number;
}