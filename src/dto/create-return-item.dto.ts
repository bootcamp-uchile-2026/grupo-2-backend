import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, Max } from 'class-validator';

export class CreateReturnItemDto {

    @ApiProperty({ example: 41 })
    @IsInt()
    @Min(1)
    orderItemId: number;

    @ApiProperty({
        minimum: 1,
        maximum: 3,
        example: 1,
    })
    @IsInt()
    @Min(1)
    @Max(3)
    quantity: number;
}