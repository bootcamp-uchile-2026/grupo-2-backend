import { ApiProperty } from '@nestjs/swagger';

export class ProductSummaryDto {

  @ApiProperty({ example: 65 })
  id: number;

  @ApiProperty({ example: 'Miel de Ulmo Artesanal 500 g' })
  name: string;

  @ApiProperty({ example: 12 })
  producerId: number;

  @ApiProperty({ example: 'Sabores de la Tierra' })
  producerName: string;

  @ApiProperty({ example: 9 })
  categoryId: number;

  @ApiProperty({
    example: 6990,
    description: 'Precio normal en pesos chilenos',
  })
  price: number;

  @ApiProperty({
    type: Number,
    nullable: true,
    example: 6291,
    description: 'Precio de oferta vigente',
  })
  offerPrice: number | null;

  @ApiProperty({
    example: 6291,
    description: 'Precio efectivo del producto',
  })
  finalPrice: number;

  @ApiProperty({ example: 10 })
  discountPercentage: number;

  @ApiProperty({ example: 19 })
  stock: number;

  @ApiProperty({ example: true })
  available: boolean;

  @ApiProperty({
    example: 3.0562,
    description: 'Kilogramos de CO2 evitado por unidad',
  })
  co2Avoided: number;

  @ApiProperty({
    example: 305,
    description: 'Puntos verdes obtenidos por unidad',
  })
  greenPoints: number;

  @ApiProperty({
    type: Number,
    nullable: true,
    example: 5,
  })
  rating: number | null;

  @ApiProperty({ example: 1 })
  reviewCount: number;

  @ApiProperty({
    type: String,
    format: 'uuid',
    nullable: true,
    example: null,
  })
  primaryImageFileId: string | null;
}
