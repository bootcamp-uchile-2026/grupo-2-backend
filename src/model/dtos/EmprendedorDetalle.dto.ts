import { ApiProperty } from '@nestjs/swagger';

export class EmprendedorDetalleDto {
  @ApiProperty({
    example: 2,
    description: 'Identificador único del emprendedor',
  })
  id: number;

  @ApiProperty({
    example: 'EcoRaíz',
    description: 'Nombre público del emprendimiento',
  })
  nombre: string;

  @ApiProperty({
    example:
      'Emprendimiento dedicado a la elaboración de productos sustentables para el hogar.',
    description: 'Descripción general del emprendimiento',
  })
  descripcion: string;

  @ApiProperty({
    example: 'https://imagen.jpg',
    description: 'URL de la imagen principal o representativa del emprendedor',
  })
  imagenUrl: string;

  @ApiProperty({
    example:
      'EcoRaíz nació con el objetivo de crear alternativas sustentables para el uso cotidiano.',
    description: 'Historia o presentación detallada del emprendimiento',
  })
  historia: string;

  constructor(){};
}