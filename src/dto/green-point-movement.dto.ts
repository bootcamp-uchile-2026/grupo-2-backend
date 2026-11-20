import { ApiProperty } from '@nestjs/swagger';
import { GreenPointMovementType } from '../models/green-point-movement.entity';

export class GreenPointMovementDto {

    @ApiProperty({ example: 59 })
    id: number;

    @ApiProperty({
        enum: GreenPointMovementType,
        example: GreenPointMovementType.REVIEW,
    })
    type: GreenPointMovementType;

    @ApiProperty({ example: 5 })
    points: number;

    @ApiProperty({
        type: Number,
        nullable: true,
    })
    orderId: number | null;

    @ApiProperty({
        type: Number,
        nullable: true,
    })
    returnId: number | null;

    @ApiProperty({
        type: Number,
        nullable: true,
        example: 21,
    })
    reviewId: number | null;

    @ApiProperty({
        type: String,
        nullable: true,
        example: 'Puntos verdes por valoración de producto',
    })
    description: string | null;

    @ApiProperty({
        type: String,
        format: 'date-time',
    })
    createdAt: Date;
}