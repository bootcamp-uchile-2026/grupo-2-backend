import { ApiProperty } from '@nestjs/swagger';

export class OrderItemResponseDto {

    @ApiProperty({ example: 41 })
    id: number;

    @ApiProperty({ example: 65 })
    productId: number;

    @ApiProperty({ example: 'Miel de Ulmo Artesanal 500 g' })
    productName: string;

    @ApiProperty({
        example: 'Miel de sabor suave y aroma floral.',
    })
    productDescription: string;

    @ApiProperty({
        type: String,
        nullable: true,
        example: null,
    })
    productSize: string | null;

    @ApiProperty({
        type: String,
        nullable: true,
        example: null,
    })
    productColor: string | null;

    @ApiProperty({
        type: String,
        nullable: true,
        example: null,
    })
    productMaterial: string | null;

    @ApiProperty({ example: 2 })
    quantity: number;

    @ApiProperty({ example: 6291 })
    unitPrice: number;

    @ApiProperty({ example: 3.0562 })
    unitCo2Avoided: number;

    @ApiProperty({ example: 305 })
    unitGreenPoints: number;

    @ApiProperty({ example: 12582 })
    subtotal: number;

    @ApiProperty({ example: 300 })
    greenPointDiscount: number;

    @ApiProperty({ example: 12282 })
    total: number;

    @ApiProperty({ example: false })
    isPrepared: boolean;

    @ApiProperty({
        type: Date,
        nullable: true,
        example: null,
    })
    preparedAt: Date | null;
}