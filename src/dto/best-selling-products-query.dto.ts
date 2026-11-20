import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min, Max } from 'class-validator';

export class BestSellingProductsQueryDto {

    @ApiProperty({ description: 'Cantidad de productos', example: 5 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    quantity: number;

    @ApiPropertyOptional({ description: 'Identificador de la categoría', example: 9 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    categoryId?: number;
}