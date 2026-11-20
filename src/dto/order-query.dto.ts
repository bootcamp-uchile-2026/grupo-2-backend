import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginationDto } from './pagination.dto';
import { OrderStatus } from '../models/order.entity';

export class OrderQueryDto extends PaginationDto {

    @ApiPropertyOptional({
        description: 'Estado del pedido',
        enum: OrderStatus,
        example: OrderStatus.DELIVERED,
    })
    @IsOptional()
    @IsEnum(OrderStatus)
    status?: OrderStatus;
}