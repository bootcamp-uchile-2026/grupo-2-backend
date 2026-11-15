import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus, PaymentStatus} from '../models/order.entity';

export class OrderSummaryDto {

    @ApiProperty({ example: 21 })
    id: number;

    @ApiProperty({ example: 6 })
    customerId: number;

    @ApiProperty({ enum: OrderStatus })
    status: OrderStatus;

    @ApiProperty({ enum: PaymentStatus })
    paymentStatus: PaymentStatus;

    @ApiProperty({ example: 3 })
    totalProducts: number;

    @ApiProperty({ example: 4 })
    totalItems: number;

    @ApiProperty({
        example: 28554,
        description: 'Importe original del pedido en pesos chilenos',
    })
    total: number;

    @ApiProperty({
        example: 1258,
        description: 'Puntos verdes estimados de la compra',
    })
    estimatedGreenPoints: number;

    @ApiProperty({
        example: 12.6048,
        description: 'Kilogramos de CO2 evitado estimados',
    })
    estimatedCo2Avoided: number;

    @ApiProperty({
        type: Date,
        example: '2026-11-15T21:18:55.433Z',
    })
    createdAt: Date;
}