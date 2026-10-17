import { ApiProperty } from '@nestjs/swagger';

export class SubCategoriaDto {
  @ApiProperty({
    description: 'ID de la subcategoría',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Nombre de la subcategoría',
    example: 'Poleras',
  })
  nombre: string;

  @ApiProperty({
    description: 'Identificador de texto amigable para la URL',
    example: 'poleras',
  })
  slug: string;

  @ApiProperty({
    description: 'URL de la imagen representativa de la subcategoría',
    example: 'https://ejemplo.cl/imagenes/subcategorias/poleras.jpg',
    required: false,
  })
  imagenUrl?: string;

  constructor(){};
}