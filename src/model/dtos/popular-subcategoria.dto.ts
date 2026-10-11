import { ApiProperty } from "@nestjs/swagger";

export class PopularSubCategoriaDto {
  @ApiProperty({
    description: 'Identificador único del producto.',
    example: 15,
  })
  id: number;

  @ApiProperty({
    description: 'Nombre del producto.',
    example: 'Polera de algodón orgánico',
  })
  nombre: string;

  @ApiProperty({
    description: 'Precio del producto expresado en pesos chilenos.',
    example: 12990,
  })
  precio: number;

  @ApiProperty({
    description: 'URL de la imagen representativa del producto.',
    example: 'https://ejemplo.cl/imagenes/productos/polera.jpg',
    required: false,
  })
  imagenUrl?: string;

  constructor(){};
}