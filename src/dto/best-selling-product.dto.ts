import { ApiProperty } from '@nestjs/swagger';

export class BestSellingProductDto {
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
    example: 4.5,
    nullable: true,
    description:
      'Puntuación promedio del producto. Si no posee valoraciones, su valor es null',
  })
  rating: number | null;

  @ApiProperty({
    example: 'https://ejemplo.cl/imagenes/bolsa-algodon.jpg',
    description: 'URL de la imagen principal del producto',
  })
  imageUrl: string;
}
