import { ApiProperty } from '@nestjs/swagger';

export class ProductoRelacionadoDto {
  @ApiProperty({
    example: 2,
    description: 'Identificador único del producto',
  })
  id: number;

  @ApiProperty({
    example: 'EcoWear',
    description: 'Marca del producto',
  })
  marca: string;

  @ApiProperty({
    example: 'Polera orgánica',
    description: 'Nombre del producto',
  })
  nombre: string;

  @ApiProperty({
    example: 15990,
    description: 'Precio actual del producto',
  })
  precio: number;

  @ApiProperty({
    example: 'https://ejemplo.cl/productos/polera-organica.jpg',
    description: 'URL de la imagen principal del producto',
  })
  imagenUrl: string;

  constructor(){};
}