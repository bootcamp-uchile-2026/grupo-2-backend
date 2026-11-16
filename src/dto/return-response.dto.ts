import { ApiProperty } from '@nestjs/swagger';
import { ReturnStatus } from '../models/return.entity';
import { ReturnItemResponseDto } from './return-item-response.dto';

export class ReturnResponseDto {

    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 21 })
    orderId: number;

    @ApiProperty({ example: 6 })
    customerId: number;

    @ApiProperty({
        enum: ReturnStatus,
        example: ReturnStatus.COMPLETED,
    })
    status: ReturnStatus;

    @ApiProperty({
        example: 'El producto no cumple con mis expectativas.',
    })
    reason: string;

    @ApiProperty({
        type: String,
        nullable: true,
        example: 'Producto recibido en buenas condiciones.',
    })
    adminNotes: string | null;

    @ApiProperty({
        type: Number,
        nullable: true,
        example: 15,
    })
    processedBy: number | null;

    @ApiProperty({
        type: [ReturnItemResponseDto],
    })
    items: ReturnItemResponseDto[];

    @ApiProperty({ example: 1 })
    totalItems: number;

    @ApiProperty({ example: 8800 })
    totalRefundAmount: number;

    @ApiProperty({ example: 190 })
    totalGreenPointsRestored: number;

    @ApiProperty({ example: 340 })
    totalGreenPointsReversed: number;

    @ApiProperty({ example: 3.4012 })
    totalCo2AvoidedReversed: number;

    @ApiProperty({
        type: String,
        format: 'date-time',
    })
    createdAt: Date;

    @ApiProperty({
        type: String,
        format: 'date-time',
    })
    updatedAt: Date;

    @ApiProperty({
        type: String,
        format: 'date-time',
        nullable: true,
    })
    completedAt: Date | null;
}