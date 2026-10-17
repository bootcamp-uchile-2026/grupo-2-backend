import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class AddFavoriteDto {

  @ApiProperty({
    description: 'Identificador del producto que se agregará a favoritos.',
    example: 12,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  productId: number;
}
