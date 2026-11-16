import { ApiProperty } from '@nestjs/swagger';

export class ReturnItemResponseDto {

    @ApiProperty({ example: 41 })
    orderItemId: number;

    @ApiProperty({ example: 65 })
    productId: number;

    @ApiProperty({
        example: 'Miel de Ulmo Artesanal 500 g',
    })
    productName: string;

    @ApiProperty({ example: 1 })
    quantity: number;

    @ApiProperty({ example: 8990 })
    unitPrice: number;

    @ApiProperty({ example: 8800 })
    refundAmount: number;

    @ApiProperty({ example: 190 })
    greenPointsRestored: number;

    @ApiProperty({ example: 340 })
    greenPointsReversed: number;

    @ApiProperty({ example: 3.4012 })
    co2AvoidedReversed: number;

    @ApiProperty({ example: true })
    restock: boolean;
}