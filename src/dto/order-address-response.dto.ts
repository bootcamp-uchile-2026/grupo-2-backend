import { ApiProperty } from '@nestjs/swagger';

export class OrderAddressResponseDto {

    @ApiProperty({ example: 11 })
    addressId: number;

    @ApiProperty({ example: 'María González' })
    recipientName: string;

    @ApiProperty({ example: '+56912345678' })
    recipientPhone: string;

    @ApiProperty({ example: 'Avenida Providencia' })
    street: string;

    @ApiProperty({ example: '1234' })
    streetNumber: string;

    @ApiProperty({
        type: String,
        nullable: true,
        example: '502',
    })
    apartment: string | null;

    @ApiProperty({ example: 'Providencia' })
    commune: string;

    @ApiProperty({ example: 'Metropolitana de Santiago' })
    region: string;

    @ApiProperty({
        type: String,
        nullable: true,
        example: 'Entregar en conserjería.',
    })
    reference: string | null;
}