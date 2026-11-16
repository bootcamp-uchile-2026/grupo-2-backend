import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsArray, IsInt, Min, ArrayUnique } from 'class-validator';
import { ReturnStatus } from '../models/return.entity';

export class UpdateReturnStatusDto {

    @ApiProperty({
        enum: ReturnStatus,
        example: ReturnStatus.APPROVED,
    })
    @IsEnum(ReturnStatus)
    status: ReturnStatus;

    @ApiPropertyOptional({
        type: String,
        nullable: true,
        example: 'Devolución revisada y aprobada.',
    })
    @IsOptional()
    @IsString()
    adminNotes?: string | null;

    @ApiPropertyOptional({
        type: [Number],
        example: [41],
        description: 'Identificadores de los ítems del pedido que pueden reincorporarse al stock.',
    })
    @IsOptional()
    @IsArray()
    @ArrayUnique()
    @IsInt({ each: true })
    @Min(1, { each: true })
    restockOrderItemIds?: number[];
}