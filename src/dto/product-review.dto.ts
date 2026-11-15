import { ApiProperty } from '@nestjs/swagger';

export class ProductReviewDto {

  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'María' })
  author: string;

  @ApiProperty({
    type: String,
    nullable: true,
    example: 'Muy buen producto.',
  })
  comment: string | null;

  @ApiProperty({
    minimum: 1,
    maximum: 5,
    example: 5,
  })
  rating: number;

  @ApiProperty({
    type: String,
    format: 'date-time',
  })
  createdAt: Date;
}