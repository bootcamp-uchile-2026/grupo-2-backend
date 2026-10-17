import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';

export class SubcategoryProductDto {
  @ApiProperty({
    description: 'Identificador único del producto.',
    example: 15,
  })
  id: number;

  @ApiProperty({
    description: 'Nombre del producto.',
    example: 'Polera de algodón orgánico',
  })
  name: string;

  @ApiProperty({
    description: 'Descripción detallada del producto.',
    example: 'Polera confeccionada con algodón orgánico.',
  })
  description: string;

  @ApiProperty({
    description: 'Precio del producto expresado en pesos chilenos.',
    example: 12990,
  })
  price: number;

  @ApiPropertyOptional({
    description: 'URL de la imagen representativa del producto.',
    example: 'https://ejemplo.cl/imagenes/productos/polera.jpg',
  })
  imageUrl?: string;

  @ApiProperty({
    description: 'Cantidad de unidades disponibles del producto.',
    example: 25,
  })
  stock: number;
}
