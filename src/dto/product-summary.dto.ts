import { ApiProperty } from '@nestjs/swagger';

export class ProductSummaryDto {
  @ApiProperty({
    example: 10,
    description: 'Identificador único del producto',
  })
  id: number;

  @ApiProperty({
    example: 'EcoRaíz',
    description: 'Marca del producto',
  })
  brand: string;

  @ApiProperty({
    example: 'Bolsa Reutilizable de Algodón',
    description: 'Nombre del producto',
  })
  name: string;

  @ApiProperty({
    example: 5990,
    description: 'Precio actual del producto',
  })
  price: number;

  @ApiProperty({
    example: 'https://imagen.jpg',
    description: 'URL de la imagen principal del producto',
  })
  imageUrl: string;
}
