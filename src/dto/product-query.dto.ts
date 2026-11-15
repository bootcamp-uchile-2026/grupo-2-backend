import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsInt, Min, MaxLength } from 'class-validator';
import { PaginationDto } from './pagination.dto';

export class ProductQueryDto extends PaginationDto {

    @ApiPropertyOptional({
        description: 'Texto para buscar productos por nombre',
        example: 'polera',
    })
    @IsOptional()
    @IsString()
    @MaxLength(200)
    search?: string;

    @ApiPropertyOptional({
        description: 'Identificador de la categoría',
        example: 9,
        type: Number,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    categoryId?: number;

    @ApiPropertyOptional({
        description: 'Identificador del productor',
        example: 9,
        type: Number,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    producerId?: number;
}