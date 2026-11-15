import { ApiProperty } from '@nestjs/swagger';
import { ProductSummaryDto } from './product-summary.dto';

export class BestSellingProductDto extends ProductSummaryDto {

  @ApiProperty({
    example: 2,
    description: 'Unidades netas vendidas durante los últimos 30 días',
  })
  unitsSold: number;
}