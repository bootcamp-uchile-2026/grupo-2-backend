import { ApiProperty } from '@nestjs/swagger';

export class ProductImageDto {

    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 65 })
    productId: number;

    @ApiProperty({ format: 'uuid' })
    fileId: string;

    @ApiProperty({ example: 1 })
    displayOrder: number;

    @ApiProperty({ example: true })
    isPrimary: boolean;
}