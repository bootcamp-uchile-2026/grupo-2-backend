import { ApiProperty } from '@nestjs/swagger';

export class ProductOfferDto {
  @ApiProperty({
    example: 25,
    description: 'Identificador único del producto',
  })
  id: number;

  @ApiProperty({
    example: 'EcoHome',
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
    description: 'Precio normal del producto antes del descuento',
  })
  originalPrice: number;

  @ApiProperty({
    example: 4490,
    description: 'Precio final del producto con el descuento aplicado',
  })
  discountedPrice: number;

  @ApiProperty({
    example: 25,
    description: 'Porcentaje de descuento aplicado al producto',
  })
  discountPercentage: number;

  @ApiProperty({
    example: 'https://ejemplo.cl/imagenes/bolsa-algodon.jpg',
    description: 'URL de la imagen principal del producto',
  })
  imageUrl: string;
}
