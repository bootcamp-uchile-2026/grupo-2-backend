import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsDateString, Min, Max, MaxLength, Matches } from 'class-validator';

export class ProductSpecializedDetailsDto {

    @ApiPropertyOptional({
        example: 500,
        nullable: true,
    })
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0.01)
    @Max(99999999.99)
    weightG?: number | null;

    @ApiPropertyOptional({
        example: 250,
        nullable: true,
    })
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0.01)
    @Max(99999999.99)
    volumeMl?: number | null;

    @ApiPropertyOptional({
        example: 'Ingredientes naturales',
        nullable: true,
    })
    @IsOptional()
    @IsString()
    ingredients?: string | null;

    @ApiPropertyOptional({
        example: 'Puede contener frutos secos',
        nullable: true,
    })
    @IsOptional()
    @IsString()
    allergens?: string | null;

    @ApiPropertyOptional({
        example: '2027-12-31',
        nullable: true,
    })
    @IsOptional()
    @IsDateString({ strict: true })
    @Matches(/^\d{4}-\d{2}-\d{2}$/)
    expirationDate?: string | null;

    @ApiPropertyOptional({
        example: 'Todo tipo de piel',
        nullable: true,
    })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    skinType?: string | null;

    @ApiPropertyOptional({
        example: 'Algodón',
        nullable: true,
    })
    @IsOptional()
    @IsString()
    @MaxLength(150)
    material?: string | null;

    @ApiPropertyOptional({
        example: 15,
        nullable: true,
    })
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0.01)
    @Max(99999999.99)
    heightCm?: number | null;

    @ApiPropertyOptional({
        example: 20,
        nullable: true,
    })
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0.01)
    @Max(99999999.99)
    widthCm?: number | null;

    @ApiPropertyOptional({
        example: 10,
        nullable: true,
    })
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0.01)
    @Max(99999999.99)
    depthCm?: number | null;

    @ApiPropertyOptional({
        example: 'Exterior',
        nullable: true,
    })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    usageType?: string | null;

    @ApiPropertyOptional({
        example: 'Componentes biodegradables',
        nullable: true,
    })
    @IsOptional()
    @IsString()
    composition?: string | null;

    @ApiPropertyOptional({
        example: 'Madera y cerámica',
        nullable: true,
    })
    @IsOptional()
    @IsString()
    @MaxLength(150)
    applicationSurface?: string | null;

    @ApiPropertyOptional({
        example: 'Lavanda',
        nullable: true,
    })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    fragrance?: string | null;

    @ApiPropertyOptional({
        example: 30,
        nullable: true,
    })
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0.01)
    @Max(999999.99)
    durationHours?: number | null;

    @ApiPropertyOptional({
        example: 'Vela',
        nullable: true,
    })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    format?: string | null;

    @ApiPropertyOptional({
        example: 'L',
        nullable: true,
    })
    @IsOptional()
    @IsString()
    @MaxLength(30)
    size?: string | null;

    @ApiPropertyOptional({
        example: 'Verde',
        nullable: true,
    })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    color?: string | null;

    @ApiPropertyOptional({
        example: 'Perro',
        nullable: true,
    })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    petType?: string | null;
}