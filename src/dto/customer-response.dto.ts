import { ApiProperty } from '@nestjs/swagger';

export class CustomerResponseDto {

  @ApiProperty({ example: 6 })
  id: number;

  @ApiProperty({ example: 24 })
  userId: number;

  @ApiProperty({ example: 'María' })
  firstName: string;

  @ApiProperty({
    example: 'González',
    type: String,
    nullable: true,
  })
  lastName: string | null;

  @ApiProperty({
    example: 'maria@buenorigen.test',
  })
  email: string;

  @ApiProperty({
    example: '+56912345678',
    type: String,
    nullable: true,
  })
  phone: string | null;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({
    type: String,
    format: 'uuid',
    nullable: true,
    example: null,
  })
  profileFileId: string | null;

  @ApiProperty({ example: 751 })
  greenPoints: number;

  @ApiProperty({
    type: String,
    format: 'date-time',
  })
  privacyAcceptedAt: string;

  @ApiProperty({
    type: String,
    format: 'date-time',
  })
  createdAt: string;
}
