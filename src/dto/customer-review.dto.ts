import { ApiProperty } from '@nestjs/swagger';

export class CustomerReviewDto {

    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 6 })
    customerId: number;

    @ApiProperty({ example: 65 })
    productId: number;

    @ApiProperty({ example: 'Miel Multifloral' })
    productName: string;

    @ApiProperty({
        minimum: 1,
        maximum: 5,
        example: 5,
    })
    rating: number;

    @ApiProperty({
        type: String,
        nullable: true,
        example: 'Muy buen producto.',
    })
    comment: string | null;

    @ApiProperty({
        type: String,
        format: 'date-time',
    })
    createdAt: Date;

    @ApiProperty({
        type: String,
        format: 'date-time',
    })
    updatedAt: Date;
}