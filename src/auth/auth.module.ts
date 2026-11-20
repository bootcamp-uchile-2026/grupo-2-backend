import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { StringValue } from 'ms';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserEntity } from '../models/user.entity';
import { CustomerEntity } from '../models/customer.entity';
import { ProducerEntity } from '../models/producer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      CustomerEntity,
      ProducerEntity,
    ]),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {

        const secret = configService.get<string>('JWT_SECRET');

        if (!secret) {
          throw new Error('JWT_SECRET no está configurado');
        }

        return {
          secret,
          signOptions: {
            expiresIn: configService.get<string>(
              'JWT_EXPIRES_IN',
              '1h',
            ) as StringValue,
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule { }