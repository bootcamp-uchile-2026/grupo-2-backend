import { ApiProperty } from '@nestjs/swagger';
import { ProducerSummaryDto } from './producer-summary.dto';

export class ProducerDetailDto extends ProducerSummaryDto {

  @ApiProperty({
    type: String,
    format: 'uuid',
    nullable: true,
    example: null,
  })
  bannerFileId: string | null;

  @ApiProperty({
    type: String,
    nullable: true,
    example: 'https://ejemplo.cl',
  })
  websiteUrl: string | null;
}