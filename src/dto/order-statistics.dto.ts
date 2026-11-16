import { ApiProperty } from '@nestjs/swagger';

export class OrderStatisticsDto {

    @ApiProperty({ example: 15 })
    totalOrders: number;

    @ApiProperty({ example: 1 })
    pendingOrders: number;

    @ApiProperty({ example: 2 })
    confirmedOrders: number;

    @ApiProperty({ example: 2 })
    preparingOrders: number;

    @ApiProperty({ example: 1 })
    shippedOrders: number;

    @ApiProperty({ example: 7 })
    deliveredOrders: number;

    @ApiProperty({ example: 2 })
    cancelledOrders: number;

    @ApiProperty({ example: 35 })
    netUnitsSold: number;

    @ApiProperty({ example: 350000 })
    netSales: number;

    @ApiProperty({ example: 105.4562 })
    co2Avoided: number;
}