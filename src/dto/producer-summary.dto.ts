import { ApiProperty } from '@nestjs/swagger';

export class ProducerSummaryDto {

  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'EcoRaíz' })
  businessName: string;

  @ApiProperty({
    type: String,
    nullable: true,
    example: 'Emprendimiento de productos sustentables.',
  })
  description: string | null;

  @ApiProperty({
    type: String,
    format: 'uuid',
    nullable: true,
    example: null,
  })
  logoFileId: string | null;

  @ApiProperty({
    type: String,
    nullable: true,
    example: 'Santiago, Chile',
  })
  location: string | null;
}