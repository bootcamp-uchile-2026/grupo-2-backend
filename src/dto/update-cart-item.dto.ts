import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, Max } from 'class-validator';

export class UpdateCartItemDto {

    @ApiProperty({
        description: 'Nueva cantidad del producto dentro del carrito.',
        example: 3,
        minimum: 1,
        maximum: 3
    })
    @IsInt()
    @Min(1)
    @Max(3)
    quantity: number;
}