import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min, Max } from 'class-validator';

export class CreateReviewDto {

    @ApiProperty({ example: 65 })
    @IsInt()
    @Min(1)
    productId: number;

    @ApiProperty({
        minimum: 1,
        maximum: 5,
        example: 5,
    })
    @IsInt()
    @Min(1)
    @Max(5)
    rating: number;

    @ApiPropertyOptional({
        type: String,
        nullable: true,
        example: 'Excelente producto, totalmente recomendado.',
    })
    @IsOptional()
    @IsString()
    comment?: string | null;
}