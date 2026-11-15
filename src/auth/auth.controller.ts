import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from '../dto/login.dto';
import { LoginResponseDto } from '../dto/login-response.dto';
import { UserRole } from '../models/user.entity';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles/roles.guard';
import { JwtAuthGuard } from '../common/guards/jwt-auth/jwt-auth.guard';

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

  @Get('admin-test')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Verificar acceso de administrador',
  })
  @ApiOkResponse({
    description: 'Acceso autorizado.',
  })
  @ApiUnauthorizedResponse({
    description: 'Token inválido o inexistente.',
  })
  @ApiForbiddenResponse({
    description: 'Acceso denegado.',
  })
  adminTest() {
    return {
      message: 'Acceso autorizado para administradores',
    };
  }
}