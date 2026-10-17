import { ApiProperty } from "@nestjs/swagger";

export class ProductoSubCategoriaDto {
  @ApiProperty({
    example: 15,
  })
  id: number;

  @ApiProperty({
    example: 'Polera de algodón orgánico',
  })
  nombre: string;

  @ApiProperty({
    example: 'Polera confeccionada con algodón orgánico.',
  })
  descripcion: string;

  @ApiProperty({
    example: 12990,
  })
  precio: number;

  @ApiProperty({
    example: 'https://ejemplo.cl/imagenes/productos/polera.jpg',
    required: false,
  })
  imagenUrl?: string;

  @ApiProperty({
    example: 25,
  })
  stock: number;

  constructor(){};
}