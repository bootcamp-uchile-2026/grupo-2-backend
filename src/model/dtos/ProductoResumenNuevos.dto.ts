import { ApiProperty } from '@nestjs/swagger';

export class ProductoResumenNuevosDto {
  @ApiProperty({
    example: 103,
    description: 'Identificador único del producto',
  })
  id: number;

  @ApiProperty({
    example: 'Bolsa Reutilizable de Algodón',
    description: 'Nombre del producto',
  })
  nombre: string;

  @ApiProperty({
    example: 5990,
    description: 'Precio normal del producto',
  })
  precio: number;

  @ApiProperty({
    example: 4990,
    nullable: true,
    description:
      'Precio de oferta del producto cuando corresponde. Si no posee oferta, su valor es null',
  })
  precioOferta: number | null;

  @ApiProperty({
    example: 'https://ejemplo.cl/imagenes/bolsa-algodon.jpg',
    description: 'URL de la imagen principal del producto',
  })
  imagenUrl: string;

  constructor(){}
}