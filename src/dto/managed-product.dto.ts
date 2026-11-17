import { ApiProperty } from '@nestjs/swagger';
import { ProductDetailDto } from './product-detail.dto';
import { ProductImageDto } from './product-image.dto';

export class ManagedProductDto extends ProductDetailDto {

    @ApiProperty({ example: true })
    isActive: boolean;

    @ApiProperty({
        type: Number,
        example: 5990,
        nullable: true,
    })
    configuredOfferPrice: number | null;

    @ApiProperty({
        type: String,
        format: 'date-time',
        nullable: true,
    })
    offerStartAt: Date | null;

    @ApiProperty({
        type: String,
        format: 'date-time',
        nullable: true,
    })
    offerEndAt: Date | null;

    @ApiProperty({
        type: [Number],
        example: [11, 12],
    })
    sustainabilityAttributeIds: number[];

    @ApiProperty({
        type: [ProductImageDto],
        description: 'Imágenes asociadas al producto',
    })
    images: ProductImageDto[];
}