import { ApiProperty } from '@nestjs/swagger';
import { ProducerOrderSummaryDto } from './producer-order-summary.dto';
import { OrderItemResponseDto } from './order-item-response.dto';

export class ProducerOrderDetailDto extends ProducerOrderSummaryDto {

    @ApiProperty({ type: [OrderItemResponseDto] })
    items: OrderItemResponseDto[];
}