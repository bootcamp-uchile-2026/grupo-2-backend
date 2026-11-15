import { ApiProperty } from '@nestjs/swagger';
import { ProductSummaryDto } from './product-summary.dto';

export class ProductDetailDto extends ProductSummaryDto {

  @ApiProperty({
    example: 'Producto elaborado artesanalmente.',
  })
  description: string;

  @ApiProperty({
    example: 'Alimentos',
  })
  categoryName: string;

  @ApiProperty({
    type: [String],
    description: 'Identificadores de archivos de imágenes',
    example: [],
  })
  imageFileIds: string[];

  @ApiProperty({
    type: Object,
    nullable: true,
    example: {
      size: 'L',
      color: 'Verde',
      material: 'Algodón',
    },
    description: 'Características específicas de la categoría',
  })
  details: Record<string, string | number | null> | null;
}