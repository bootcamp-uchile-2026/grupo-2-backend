import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../models/user.entity';

export class AuthenticatedUserDto {

  @ApiProperty({ example: 24 })
  id: number;

  @ApiProperty({ example: 'maria@buenorigen.test' })
  email: string;

  @ApiProperty({ example: 'María' })
  firstName: string;

  @ApiProperty({
    type: String,
    nullable: true,
    example: 'González',
  })
  lastName: string | null;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.CUSTOMER,
  })
  role: UserRole;

  @ApiProperty({
    type: Number,
    nullable: true,
    example: 6,
  })
  customerId: number | null;

  @ApiProperty({
    type: Number,
    nullable: true,
    example: null,
  })
  producerId: number | null;
}

export class LoginResponseDto {

  @ApiProperty({
    description: 'Token JWT de autenticación.',
    example: 'eyJhbGciOiJIUzI1NiIs...',
  })
  access_token: string;

  @ApiProperty({
    description: 'Información del usuario autenticado.',
    type: AuthenticatedUserDto,
  })
  user: AuthenticatedUserDto;
}