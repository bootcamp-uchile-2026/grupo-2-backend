import {ApiPropertyOptional} from '@nestjs/swagger';
import {IsString,IsNotEmpty,MaxLength,IsInt,IsNumber, Min,Max,IsBoolean,IsOptional,IsArray,ArrayUnique,IsObject,IsDateString,ValidateNested,ValidateIf} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductSpecializedDetailsDto }from './product-specialized-details.dto';

export class UpdateProductDto {

    @ApiPropertyOptional({
        example: 'Miel artesanal 500 g',
    })
    @ValidateIf((object, value) => value !== undefined)
    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    name?: string;

    @ApiPropertyOptional({
        example: 'Nueva descripción del producto.',
    })
    @ValidateIf((object, value) => value !== undefined)
    @IsString()
    @IsNotEmpty()
    description?: string;

    @ApiPropertyOptional({ example: 7490 })
    @ValidateIf((object, value) => value !== undefined)
    @IsInt()
    @Min(1)
    @Max(2147483647)
    price?: number;

    @ApiPropertyOptional({ example: 15 })
    @ValidateIf((object, value) => value !== undefined)
    @IsInt()
    @Min(0)
    @Max(2147483647)
    stock?: number;

    @ApiPropertyOptional({ example: 3.2500 })
    @ValidateIf((object, value) => value !== undefined)
    @IsNumber({ maxDecimalPlaces: 4 })
    @Min(0)
    @Max(999999.9999)
    co2Avoided?: number;

    @ApiPropertyOptional({ example: false })
    @ValidateIf((object, value) => value !== undefined)
    @IsBoolean()
    isActive?: boolean;

    @ApiPropertyOptional({
        example: 5990,
        nullable: true,
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(2147483647)
    offerPrice?: number | null;

    @ApiPropertyOptional({
        example: '2026-11-20T00:00:00-03:00',
        nullable: true,
    })
    @IsOptional()
    @IsDateString({ strict: true })
    offerStartAt?: string | null;

    @ApiPropertyOptional({
        example: '2026-11-30T23:59:00-03:00',
        nullable: true,
    })
    @IsOptional()
    @IsDateString({ strict: true })
    offerEndAt?: string | null;

    @ApiPropertyOptional({
        type: [Number],
        example: [11, 12],
    })
    @ValidateIf((object, value) => value !== undefined)
    @IsArray()
    @ArrayUnique()
    @IsInt({ each: true })
    @Min(1, { each: true })
    sustainabilityAttributeIds?: number[];

    @ApiPropertyOptional({
        type: ProductSpecializedDetailsDto,
    })
    @ValidateIf((object, value) => value !== undefined)
    @IsObject()
    @ValidateNested()
    @Type(() => ProductSpecializedDetailsDto)
    details?: ProductSpecializedDetailsDto;
}