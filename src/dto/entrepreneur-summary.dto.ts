import { ApiProperty } from '@nestjs/swagger';

export class EntrepreneurSummaryDto {
  @ApiProperty({
    example: 1,
    description: 'Identificador único del emprendedor',
  })
  id: number;

  @ApiProperty({
    example: 'EcoRaíz',
    description: 'Nombre público del emprendimiento',
  })
  name: string;

  @ApiProperty({
    example:
      'Emprendimiento dedicado a la elaboración de productos sustentables.',
    description: 'Breve descripción del emprendedor o de su actividad',
  })
  description: string;

  @ApiProperty({
    example: 'https://imagen.jpg',
    description: 'URL de la imagen o fotografía del emprendedor',
  })
  imageUrl: string;
}
