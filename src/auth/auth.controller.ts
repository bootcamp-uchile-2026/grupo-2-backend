
import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LoginDto } from '../dto/auth/login.dto';
import { UserRole } from 'src/models/user.entity';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard';
import { LoginResponseDto } from '../dto/auth/login-response.dto';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) { }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Iniciar sesión',
    description: 'Autentica un usuario y devuelve un JWT.',
  })
  @ApiResponse({
    status: 200,
    description: 'Autenticación exitosa.',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciales inválidas o cuenta desactivada.',
  })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @ApiBearerAuth()
  @Get('admin-test')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  adminTest() {
    return {
      message: 'Acceso autorizado para administradores',
    };
  }



}
