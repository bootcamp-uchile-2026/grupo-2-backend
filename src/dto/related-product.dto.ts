import { ApiProperty } from '@nestjs/swagger';

export class RelatedProductDto {
  @ApiProperty({
    example: 2,
    description: 'Identificador único del producto',
  })
  id: number;

  @ApiProperty({
    example: 'EcoWear',
    description: 'Marca del producto',
  })
  brand: string;

  @ApiProperty({
    example: 'Polera orgánica',
    description: 'Nombre del producto',
  })
  name: string;

  @ApiProperty({
    example: 15990,
    description: 'Precio actual del producto',
  })
  price: number;

  @ApiProperty({
    example: 'https://ejemplo.cl/productos/polera-organica.jpg',
    description: 'URL de la imagen principal del producto',
  })
  imageUrl: string;
}
