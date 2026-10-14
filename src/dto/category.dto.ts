import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CategoryDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Alimentos' })
  name: string;

  @ApiProperty({ example: 'alimentos' })
  slug: string;

  @ApiPropertyOptional({
    example: 'https://ejemplo.cl/imagenes/categorias/alimentos.jpg',
  })
  imageUrl?: string;
}