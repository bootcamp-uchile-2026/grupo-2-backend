import { ApiProperty } from '@nestjs/swagger';

export class ProductSearchDto {
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
    description: 'Precio actual del producto',
  })
  price: number;

  @ApiProperty({
    example: 'https://ejemplo.cl/imagenes/bolsa-algodon.jpg',
    description: 'URL de la imagen principal del producto',
  })
  imageUrl: string;
}
