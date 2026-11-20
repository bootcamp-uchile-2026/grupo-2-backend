import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus, PaymentMethod, PaymentStatus} from '../models/order.entity';
import { OrderItemResponseDto } from './order-item-response.dto';
import { OrderAddressResponseDto } from './order-address-response.dto';

export class OrderResponseDto {

    @ApiProperty({ example: 21 })
    id: number;

    @ApiProperty({ example: 6 })
    customerId: number;

    @ApiProperty({
        enum: OrderStatus,
        example: OrderStatus.CONFIRMED,
    })
    status: OrderStatus;

    @ApiProperty({
        enum: PaymentMethod,
        example: PaymentMethod.DEBIT_CARD,
    })
    paymentMethod: PaymentMethod;

    @ApiProperty({
        enum: PaymentStatus,
        example: PaymentStatus.PAID,
    })
    paymentStatus: PaymentStatus;

    @ApiProperty({ type: OrderAddressResponseDto })
    shippingAddress: OrderAddressResponseDto;

    @ApiProperty({ type: [OrderItemResponseDto] })
    items: OrderItemResponseDto[];

    @ApiProperty({ example: 2 })
    totalProducts: number;

    @ApiProperty({ example: 3 })
    totalItems: number;

    @ApiProperty({ example: 20000 })
    subtotal: number;

    @ApiProperty({ example: 2990 })
    shippingCost: number;

    @ApiProperty({ example: 500 })
    greenPointsRedeemed: number;

    @ApiProperty({ example: 500 })
    estimatedGreenPoints: number;

    @ApiProperty({ example: 5 })
    estimatedCo2Avoided: number;

    @ApiProperty({ example: 22490 })
    total: number;

    @ApiProperty({
        example: '2026-11-15T15:00:00.000Z',
    })
    createdAt: Date;

    @ApiProperty({
        example: '2026-11-15T15:00:00.000Z',
    })
    updatedAt: Date;

    @ApiProperty({
        type: Date,
        nullable: true,
        example: '2026-11-15T15:00:00.000Z',
    })
    confirmedAt: Date | null;

    @ApiProperty({
        type: Date,
        nullable: true,
        example: null,
    })
    shippedAt: Date | null;

    @ApiProperty({
        type: Date,
        nullable: true,
        example: null,
    })
    deliveredAt: Date | null;

    @ApiProperty({
        type: Date,
        nullable: true,
        example: null,
    })
    cancelledAt: Date | null;
}