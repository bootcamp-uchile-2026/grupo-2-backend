import {ApiProperty,ApiPropertyOptional} from '@nestjs/swagger';
import {IsString,IsNotEmpty,MaxLength,IsInt,IsNumber,Min,Max,IsBoolean,IsOptional,IsArray,ArrayUnique,IsObject,ValidateNested} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductSpecializedDetailsDto }
    from './product-specialized-details.dto';

export class CreateProductDto {

    @ApiProperty({ example: 9 })
    @IsInt()
    @Min(1)
    categoryId: number;

    @ApiProperty({ example: 'Miel artesanal 500 g' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    name: string;

    @ApiProperty({
        example: 'Miel natural de producción sustentable.',
    })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ example: 6990 })
    @IsInt()
    @Min(1)
    @Max(2147483647)
    price: number;

    @ApiProperty({ example: 20 })
    @IsInt()
    @Min(0)
    @Max(2147483647)
    stock: number;

    @ApiProperty({ example: 3.0562 })
    @IsNumber({ maxDecimalPlaces: 4 })
    @Min(0)
    @Max(999999.9999)
    co2Avoided: number;

    @ApiPropertyOptional({
        example: true,
        default: true,
    })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @ApiPropertyOptional({
        type: [Number],
        example: [11, 12],
    })
    @IsOptional()
    @IsArray()
    @ArrayUnique()
    @IsInt({ each: true })
    @Min(1, { each: true })
    sustainabilityAttributeIds?: number[];

    @ApiPropertyOptional({
        type: ProductSpecializedDetailsDto,
    })
    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => ProductSpecializedDetailsDto)
    details?: ProductSpecializedDetailsDto;
}