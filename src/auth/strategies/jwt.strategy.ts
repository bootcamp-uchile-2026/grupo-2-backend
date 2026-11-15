import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity, UserRole } from '../../models/user.entity';

interface JwtPayload {
  sub: number;
  role: UserRole}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor(configService: ConfigService,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>) {

    const secret = configService.get<string>('JWT_SECRET');

    if (!secret) {
      throw new Error('JWT_SECRET no está configurado');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret});
  }

  async validate(payload: JwtPayload) {

    if (!Number.isInteger(payload.sub) || payload.sub <= 0) {
      throw new UnauthorizedException('Usuario no autorizado');
    }

    const user = await this.userRepository.findOne({
      where: {
        id: payload.sub,
        isActive: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no autorizado');
    }

    return {
      id: user.id,
      role: user.role,
    };
  }
}