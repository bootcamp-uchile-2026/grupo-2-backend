import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength, IsOptional, IsBoolean, Equals } from 'class-validator';

export class CreateCustomerDto {

  @ApiProperty({
    example: 'cliente@correo.com',
    description: 'Correo electrónico del cliente.',
  })
  @IsEmail()
  @MaxLength(255)
  email: string;

  @ApiProperty({
    example: 'Cliente1234!',
    description: 'Contraseña del cliente.',
    minLength: 8,
    maxLength: 128,
    writeOnly: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(128)
  password: string;

  @ApiProperty({
    example: 'Javiera',
    description: 'Nombre del cliente.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstName: string;

  @ApiPropertyOptional({
    example: 'Soto',
    description: 'Apellido del cliente.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastName?: string;

  @ApiPropertyOptional({
    example: '+56912345678',
    description: 'Teléfono del cliente.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiProperty({
    example: true,
    description: 'Aceptación de la política de privacidad.',
  })
  @IsBoolean()
  @Equals(true, {
    message: 'Debe aceptar la política de privacidad.',
  })
  privacyAccepted: boolean;
}
