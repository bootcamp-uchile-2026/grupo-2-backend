import { ApiProperty } from '@nestjs/swagger';

export class CustomerResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'cliente@correo.com' })
  email: string;

  @ApiProperty({ example: 0 })
  greenPoints: number;
}
