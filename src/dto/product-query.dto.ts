import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsOptional, IsString, IsInt, Min, MaxLength, IsBoolean, IsArray, ArrayUnique } from 'class-validator';
import { PaginationDto } from './pagination.dto';

export class ProductQueryDto extends PaginationDto {

    @ApiPropertyOptional({ description: 'Texto para buscar productos por nombre', example: 'polera' })
    @IsOptional()
    @IsString()
    @MaxLength(200)
    search?: string;

    @ApiPropertyOptional({ description: 'Identificador de la categoría', example: 9, type: Number })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    categoryId?: number;

    @ApiPropertyOptional({ description: 'Identificador del productor', example: 9, type: Number })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    producerId?: number;

    @ApiPropertyOptional({ description: 'Precio efectivo mínimo', example: 3000, type: Number })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    minPrice?: number;

    @ApiPropertyOptional({ description: 'Precio efectivo máximo', example: 15000, type: Number })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    maxPrice?: number;

    @ApiPropertyOptional({ description: 'Filtrar por disponibilidad de stock', example: true, type: Boolean })
    @IsOptional()
    @Transform(({ value }) => value === 'true' ? true : value === 'false' ? false : value)
    @IsBoolean()
    available?: boolean;

    @ApiPropertyOptional({ description: 'Filtrar por ofertas vigentes', example: true, type: Boolean })
    @IsOptional()
    @Transform(({ value }) => value === 'true' ? true : value === 'false' ? false : value)
    @IsBoolean()
    onSale?: boolean;

    @ApiPropertyOptional({ description: 'Identificadores de atributos de sustentabilidad separados por comas', example: '11,12', type: String })
    @IsOptional()
    @Transform(({ value }) => {
        const values = Array.isArray(value) ? value : [value];
        return values.flatMap(item => String(item).split(',')).map(item => Number(item));
    })
    @IsArray()
    @ArrayUnique()
    @IsInt({ each: true })
    @Min(1, { each: true })
    sustainabilityAttributeIds?: number[];
}