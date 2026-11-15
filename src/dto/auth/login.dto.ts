
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'usuario@correo.com',
    description: 'Correo electrónico registrado',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'MiPassword123!',
    description: 'Contraseña de la cuenta',
  })
  @IsString()
  @IsNotEmpty()
  password!: string;
}
