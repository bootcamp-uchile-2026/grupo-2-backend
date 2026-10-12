import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({
    example: 'cliente@correo.com',
    description: 'Correo electrónico del cliente.',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'clave1234',
    description: 'Contraseña del cliente, mínimo 8 caracteres.',
    minLength: 8,
    writeOnly: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
