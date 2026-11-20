import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '../models/order.entity';

export class ProducerOrderSummaryDto {

    @ApiProperty({ example: 21 })
    id: number;

    @ApiProperty({ enum: OrderStatus })
    status: OrderStatus;

    @ApiProperty({ example: 1 })
    totalProducts: number;

    @ApiProperty({ example: 2 })
    totalItems: number;

    @ApiProperty({
        example: 12582,
        description: 'Subtotal de los productos del productor',
    })
    subtotal: number;

    @ApiProperty({
        example: 0,
        description: 'Cantidad de líneas de productos preparadas',
    })
    preparedProducts: number;

    @ApiProperty({ example: false })
    isPrepared: boolean;

    @ApiProperty({ type: Date })
    createdAt: Date;

    @ApiProperty({ type: Date })
    updatedAt: Date;
}