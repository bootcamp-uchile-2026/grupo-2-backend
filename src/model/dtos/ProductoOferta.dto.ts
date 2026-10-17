import { ApiProperty } from '@nestjs/swagger';

export class ProductoOfertaDto {
  @ApiProperty({
    example: 25,
    description: 'Identificador único del producto',
  })
  id: number;

  @ApiProperty({
    example: 'EcoHome',
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
    description: 'Precio normal del producto antes del descuento',
  })
  precioOriginal: number;

  @ApiProperty({
    example: 4490,
    description: 'Precio final del producto con el descuento aplicado',
  })
  precioDescuento: number;

  @ApiProperty({
    example: 25,
    description: 'Porcentaje de descuento aplicado al producto',
  })
  descuentoPorcentaje: number;

  @ApiProperty({
    example: 'https://ejemplo.cl/imagenes/bolsa-algodon.jpg',
    description: 'URL de la imagen principal del producto',
  })
  imagenUrl: string;

  constructor(){};
}