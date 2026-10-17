import { ApiProperty } from '@nestjs/swagger';

export class ProductGreenFootprintDto {
  @ApiProperty({
    example: 4.8,
    nullable: true,
    description: 'Calificación sustentable del producto en una escala de 1 a 5',
  })
  sustainabilityRating: number | null;

  @ApiProperty({
    type: [String],
    example: ['Algodón orgánico', 'Tintes naturales'],
    description: 'Materiales utilizados en la elaboración del producto',
  })
  materials: string[];

  @ApiProperty({
    example:
      'Producto confeccionado mediante procesos de bajo impacto ambiental',
    nullable: true,
    description: 'Descripción resumida del proceso de elaboración',
  })
  productionProcess: string | null;
}
