import { ApiProperty } from '@nestjs/swagger';

export class ProducerStatisticsDto {

    @ApiProperty({ example: 12 })
    producerId: number;

    @ApiProperty({ example: 8 })
    totalProducts: number;

    @ApiProperty({ example: 7 })
    activeProducts: number;

    @ApiProperty({ example: 1 })
    inactiveProducts: number;

    @ApiProperty({ example: 2 })
    outOfStockProducts: number;

    @ApiProperty({ example: 15 })
    netUnitsSold: number;

    @ApiProperty({ example: 125000 })
    netSales: number;

    @ApiProperty({ example: 3 })
    pendingPreparationItems: number;

    @ApiProperty({ example: 45.3281 })
    co2Avoided: number;
}