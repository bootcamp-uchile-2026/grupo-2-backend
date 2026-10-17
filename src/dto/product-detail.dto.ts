import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProductDetailDto {
  @ApiProperty({
    example: 25,
    description: 'Identificador único del producto',
  })
  id: number;

  @ApiProperty({
    example: 'Polera Sustentable',
    description: 'Nombre del producto',
  })
  name: string;

  @ApiProperty({
    example: 18990,
    description: 'Precio actual del producto',
  })
  price: number;

  @ApiProperty({
    example: 'Polera confeccionada con materiales de origen sustentable.',
    description: 'Descripción del producto',
  })
  description: string;

  @ApiProperty({
    type: [String],
    example: [
      'https://ejemplo.cl/imagenes/polera-1.jpg',
      'https://ejemplo.cl/imagenes/polera-2.jpg',
    ],
    description: 'Imágenes asociadas al producto',
  })
  images: string[];

  @ApiPropertyOptional({
    type: [String],
    example: ['Negro', 'Blanco'],
    description: 'Colores disponibles del producto cuando corresponda',
  })
  colors?: string[];

  @ApiPropertyOptional({
    type: [String],
    example: ['S', 'M', 'L'],
    description: 'Tallas disponibles del producto cuando corresponda',
  })
  sizes?: string[];
}
