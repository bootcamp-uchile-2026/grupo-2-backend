import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, Max } from 'class-validator';

export class AddCartItemDto {

    @ApiProperty({
        description: 'Identificador del producto.',
        example: 65,
        minimum: 1})
    @IsInt()
    @Min(1)
    productId: number;

    @ApiProperty({
        description: 'Cantidad de unidades que se agregarán al carrito.',
        example: 2,
        minimum: 1,
        maximum: 3})
    @IsInt()
    @Min(1)
    @Max(3)
    quantity: number;
}