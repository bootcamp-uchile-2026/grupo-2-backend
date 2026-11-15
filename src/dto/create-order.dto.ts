import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { PaymentMethod } from '../models/order.entity';

export class CreateOrderDto {

    @ApiProperty({
        description: 'Identificador de la dirección de despacho.',
        example: 11,
        minimum: 1})
    @IsInt()
    @Min(1)
    addressId: number;

    @ApiProperty({
        description: 'Método de pago seleccionado.',
        enum: PaymentMethod,
        example: PaymentMethod.DEBIT_CARD,
    })
    @IsEnum(PaymentMethod)
    paymentMethod: PaymentMethod;

    @ApiPropertyOptional({
        description: 'Cantidad de puntos verdes que se desea utilizar.',
        example: 500,
        default: 0,
        minimum: 0,
    })
    @IsOptional()
    @IsInt()
    @Min(0)
    greenPointsToRedeem: number = 0;

    @ApiProperty({
        description: 'Total informado en la vista previa de compra.',
        example: 22490,
        minimum: 1,
    })
    @IsInt()
    @Min(1)
    expectedTotal: number;
}