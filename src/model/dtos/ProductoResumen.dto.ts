import { ApiProperty } from '@nestjs/swagger';

export class ProductoResumenDto {
  @ApiProperty({
    example: 10,
    description: 'Identificador único del producto',
  })
  id: number;

  @ApiProperty({
    example: 'EcoRaíz',
    description: 'Marca del producto',
  })
  marca: string;

  @ApiProperty({
    example: 'Bolsa Reutilizable de Algodón',
    description: 'Nombre del producto',
  })
  nombre: string;

  @ApiProperty({
    example: 5990,
    description: 'Precio actual del producto',
  })
  precio: number;

  @ApiProperty({
    example: 'https://imagen.jpg',
    description: 'URL de la imagen principal del producto',
  })
  imagenUrl: string;

  constructor(){};
}