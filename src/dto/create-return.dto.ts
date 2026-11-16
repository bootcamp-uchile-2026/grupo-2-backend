import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, IsString, IsNotEmpty, IsArray, ArrayNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateReturnItemDto } from './create-return-item.dto';

export class CreateReturnDto {

    @ApiProperty({ example: 21 })
    @IsInt()
    @Min(1)
    orderId: number;

    @ApiProperty({
        example: 'El producto no cumple con mis expectativas.',
    })
    @IsString()
    @IsNotEmpty()
    reason: string;

    @ApiProperty({
        type: [CreateReturnItemDto],
    })
    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CreateReturnItemDto)
    items: CreateReturnItemDto[];
}