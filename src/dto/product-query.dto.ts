import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsOptional, IsString, IsInt, Min, MaxLength, IsBoolean, IsArray, ArrayUnique, IsNumber } from 'class-validator';
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

    @ApiPropertyOptional({ description: 'Peso mínimo en gramos', example: 100 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    minWeightG?: number;

    @ApiPropertyOptional({ description: 'Peso máximo en gramos', example: 1000 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    maxWeightG?: number;

    @ApiPropertyOptional({ description: 'Volumen mínimo en mililitros', example: 100 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    minVolumeMl?: number;

    @ApiPropertyOptional({ description: 'Volumen máximo en mililitros', example: 500 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    maxVolumeMl?: number;

    @ApiPropertyOptional({ description: 'Tipo de piel', example: 'Sensible' })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    skinType?: string;

    @ApiPropertyOptional({ description: 'Material del producto', example: 'Algodón' })
    @IsOptional()
    @IsString()
    @MaxLength(150)
    material?: string;

    @ApiPropertyOptional({ description: 'Tipo de uso', example: 'Exterior' })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    usageType?: string;

    @ApiPropertyOptional({ description: 'Superficie de aplicación', example: 'Madera' })
    @IsOptional()
    @IsString()
    @MaxLength(150)
    applicationSurface?: string;

    @ApiPropertyOptional({ description: 'Fragancia', example: 'Lavanda' })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    fragrance?: string;

    @ApiPropertyOptional({ description: 'Formato del producto', example: 'Vela' })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    format?: string;

    @ApiPropertyOptional({ description: 'Talla del producto', example: 'M' })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    productSize?: string;

    @ApiPropertyOptional({ description: 'Color del producto', example: 'Verde' })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    color?: string;

    @ApiPropertyOptional({ description: 'Tipo de mascota', example: 'Perro' })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    petType?: string;
}