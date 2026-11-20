import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { OrderStatus } from '../models/order.entity';

export class UpdateOrderStatusDto {

    @ApiProperty({
        enum: OrderStatus,
        example: OrderStatus.SHIPPED,
        description: 'Nuevo estado del pedido',
    })
    @IsEnum(OrderStatus)
    status: OrderStatus;
}