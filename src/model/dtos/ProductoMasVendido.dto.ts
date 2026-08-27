import { ApiProperty } from '@nestjs/swagger';

export class ProductoMasVendidoDto {
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
    description: 'Precio actual del producto',
  })
  precio: number;

  @ApiProperty({
    example: 4.5,
    nullable: true,
    description:
      'Puntuación o valoración promedio del producto. Si no posee valoraciones, su valor es null',
  })
  puntuacion: number | null;

  @ApiProperty({
    example: 'https://ejemplo.cl/imagenes/bolsa-algodon.jpg',
    description: 'URL de la imagen principal del producto',
  })
  imagenUrl: string;

  constructor(){};
}