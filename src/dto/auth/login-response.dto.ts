
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../models/user.entity';

export class LoginResponseDto {
  @ApiProperty({
    description: 'Token JWT de autenticación',
    example: 'eyJhbGciOiJIUzI1NiIs...',
  })
  access_token!: string;

  @ApiProperty({
    description: 'Información pública del usuario autenticado',
  })
  user!: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
  };
}
