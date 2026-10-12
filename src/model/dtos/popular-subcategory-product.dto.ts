import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PopularSubcategoryProductDto {
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
    description: 'Precio del producto expresado en pesos chilenos.',
    example: 12990,
  })
  price: number;

  @ApiPropertyOptional({
    description: 'URL de la imagen representativa del producto.',
    example: 'https://ejemplo.cl/imagenes/productos/polera.jpg',
  })
  imageUrl?: string;
}
