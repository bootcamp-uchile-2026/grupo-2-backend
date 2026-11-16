import { ApiProperty } from '@nestjs/swagger';
import { ProducerDetailDto } from './producer-detail.dto';

export class ProducerProfileDto extends ProducerDetailDto {

    @ApiProperty({ example: 30 })
    userId: number;

    @ApiProperty({ example: 'Felipe' })
    firstName: string;

    @ApiProperty({ example: 'González', type: String, nullable: true })
    lastName: string | null;

    @ApiProperty({ example: 'emprendedor@buenorigen.test' })
    email: string;

    @ApiProperty({ example: '+56912345678', type: String, nullable: true })
    phone: string | null;

    @ApiProperty({ example: true })
    isActive: boolean;

    @ApiProperty({ type: String, format: 'uuid', nullable: true, example: null })
    profileFileId: string | null;

    @ApiProperty({ type: String, format: 'date-time' })
    privacyAcceptedAt: string;

    @ApiProperty({ type: String, format: 'date-time' })
    createdAt: string;
}