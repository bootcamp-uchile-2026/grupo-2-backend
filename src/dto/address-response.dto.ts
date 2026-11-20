import { ApiProperty } from '@nestjs/swagger';

export class AddressResponseDto {

    @ApiProperty({ example: 11 })
    id: number;

    @ApiProperty({ example: 6 })
    customerId: number;

    @ApiProperty({ example: 'Casa', nullable: true, type: String })
    label: string | null;

    @ApiProperty({ example: 'María González' })
    recipientName: string;

    @ApiProperty({ example: '+56912345678' })
    recipientPhone: string;

    @ApiProperty({ example: 'Avenida Providencia' })
    street: string;

    @ApiProperty({ example: '1234' })
    streetNumber: string;

    @ApiProperty({ example: '502', nullable: true, type: String })
    apartment: string | null;

    @ApiProperty({ example: 'Providencia' })
    commune: string;

    @ApiProperty({ example: 'Metropolitana de Santiago' })
    region: string;

    @ApiProperty({
        example: 'Entregar en conserjería.',
        nullable: true,
        type: String})
    reference: string | null;

    @ApiProperty({ example: true })
    isDefault: boolean;

    @ApiProperty({ example: true })
    isActive: boolean;

    @ApiProperty({ example: '2026-11-15T15:00:00.000Z' })
    createdAt: Date;

    @ApiProperty({ example: '2026-11-15T15:00:00.000Z' })
    updatedAt: Date;
}