import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { DuplicateEmailError } from '../errors/duplicate-email.error';
import { FavoriteAlreadyExistsError } from '../errors/favorite-already-exists.error';

@Catch(DuplicateEmailError, FavoriteAlreadyExistsError, QueryFailedError)
export class ConflictFilter implements ExceptionFilter {

  catch(exception: Error, host: ArgumentsHost) {

    const response = host.switchToHttp().getResponse<Response>();

    if (exception instanceof QueryFailedError) {

      const error = exception.driverError;

      if (error.code === '23505') {

        if (error.constraint === 'users_email_key') {
          exception = new DuplicateEmailError();
        } else if (error.constraint === 'favorites_pkey') {
          exception = new FavoriteAlreadyExistsError();
        }
      }
    }

    if (exception instanceof QueryFailedError) {

      Logger.error(
        `Error de base de datos: ${exception.driverError.code}`,
        ConflictFilter.name,
      );

      return response.status(500).json({
        statusCode: 500,
        message: 'Internal server error',
      });
    }

    return response.status(409).json({
      statusCode: 409,
      message: exception.message,
    });
  }
}
