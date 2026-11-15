import { ApiProperty } from '@nestjs/swagger';

export class SustainabilityAttributeDto {

  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Reciclable' })
  name: string;

  @ApiProperty({
    type: String,
    nullable: true,
  })
  description: string | null;
}

export class ProductGreenFootprintDto {

  @ApiProperty({ example: 65 })
  productId: number;

  @ApiProperty({ example: 3.0562 })
  co2Avoided: number;

  @ApiProperty({ example: 305 })
  greenPoints: number;

  @ApiProperty({
    type: SustainabilityAttributeDto,
    isArray: true,
  })
  sustainabilityAttributes: SustainabilityAttributeDto[];
}