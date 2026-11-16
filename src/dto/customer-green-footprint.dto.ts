import { ApiProperty } from '@nestjs/swagger';

export class CustomerGreenFootprintDto {

    @ApiProperty({ example: 6 })
    customerId: number;

    @ApiProperty({
        example: 7.2524,
        description: 'Kilogramos de CO2e evitados, descontando las devoluciones completadas.',
    })
    co2Avoided: number;
}