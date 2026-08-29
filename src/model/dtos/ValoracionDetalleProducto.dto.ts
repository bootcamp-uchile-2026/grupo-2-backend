import { ApiProperty } from '@nestjs/swagger';

export class ValoracionDetalleDto {
  @ApiProperty({
    example: 1,
    description: 'Identificador único de la valoración',
  })
  id: number;

  @ApiProperty({
    example: 'María',
    description: 'Nombre público del autor de la valoración',
  })
  autor: string;

  @ApiProperty({
    example: 'Muy buen producto y excelente calidad.',
    description: 'Comentario realizado sobre el producto',
  })
  comentario: string;

  @ApiProperty({
    example: 5,
    description: 'Puntuación otorgada al producto en una escala de 1 a 5',
  })
  puntuacion: number;

  constructor(){};
}