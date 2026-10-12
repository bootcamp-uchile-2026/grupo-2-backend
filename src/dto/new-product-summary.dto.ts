import { ApiProperty } from '@nestjs/swagger';

export class NewProductSummaryDto {
  @ApiProperty({
    example: 103,
    description: 'Identificador único del producto',
  })
  id: number;

  @ApiProperty({
    example: 'Bolsa Reutilizable de Algodón',
    description: 'Nombre del producto',
  })
  name: string;

  @ApiProperty({
    example: 5990,
    description: 'Precio normal del producto',
  })
  price: number;

  @ApiProperty({
    example: 4990,
    nullable: true,
    description:
      'Precio de oferta del producto. Si no posee oferta, su valor es null',
  })
  salePrice: number | null;

  @ApiProperty({
    example: 'https://ejemplo.cl/imagenes/bolsa-algodon.jpg',
    description: 'URL de la imagen principal del producto',
  })
  imageUrl: string;
}
