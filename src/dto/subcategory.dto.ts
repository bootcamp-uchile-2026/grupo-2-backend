import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SubcategoryDto {
  @ApiProperty({
    description: 'ID de la subcategoría',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Nombre de la subcategoría',
    example: 'Poleras',
  })
  name: string;

  @ApiProperty({
    description: 'Identificador de texto amigable para la URL',
    example: 'poleras',
  })
  slug: string;

  @ApiPropertyOptional({
    description: 'URL de la imagen representativa de la subcategoría',
    example: 'https://ejemplo.cl/imagenes/subcategorias/poleras.jpg',
  })
  imageUrl?: string;
}
