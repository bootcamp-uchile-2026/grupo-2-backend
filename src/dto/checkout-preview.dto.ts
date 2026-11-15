import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class CheckoutPreviewDto {

    @ApiProperty({
        description: 'Identificador de la dirección de despacho.',
        example: 11,
        minimum: 1})
    @Type(() => Number)
    @IsInt()
    @Min(1)
    addressId: number;

    @ApiPropertyOptional({
        description: 'Cantidad de puntos verdes que se desea utilizar.',
        example: 500,
        minimum: 0,
        default: 0})
    @Type(() => Number)
    @IsOptional()
    @IsInt()
    @Min(0)
    greenPointsToRedeem: number = 0;
}