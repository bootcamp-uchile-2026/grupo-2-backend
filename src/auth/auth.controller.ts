import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiCreatedResponse, ApiBadRequestResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from '../dto/login.dto';
import { LoginResponseDto } from '../dto/login-response.dto';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) { }

  @Post('login')
  @ApiOperation({
    summary: 'Iniciar sesión',
    description: 'Autentica un usuario y devuelve un JWT.',
  })
  @ApiBody({ type: LoginDto })
  @ApiCreatedResponse({
    description: 'Autenticación exitosa.',
    type: LoginResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Datos de autenticación inválidos.',
  })
  @ApiUnauthorizedResponse({
    description: 'Credenciales inválidas o cuenta desactivada.',
  })
  login(@Body() dto: LoginDto): Promise<LoginResponseDto> {

    return this.authService.login(dto);
  }
}