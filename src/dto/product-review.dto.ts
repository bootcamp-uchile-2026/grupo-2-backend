import { ApiProperty } from '@nestjs/swagger';

export class ProductReviewDto {
  @ApiProperty({
    example: 1,
    description: 'Identificador único de la valoración',
  })
  id: number;

  @ApiProperty({
    example: 'María',
    description: 'Nombre público del autor de la valoración',
  })
  author: string;

  @ApiProperty({
    example: 'Muy buen producto y excelente calidad.',
    description: 'Comentario realizado sobre el producto',
  })
  comment: string;

  @ApiProperty({
    example: 5,
    description: 'Puntuación otorgada al producto en una escala de 1 a 5',
  })
  rating: number;
}
