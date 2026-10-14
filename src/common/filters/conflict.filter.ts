import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { DuplicateEmailError } from '../errors/duplicate-email.error';
import { FavoriteAlreadyExistsError } from '../errors/favorite-already-exists.error';

@Catch(DuplicateEmailError, FavoriteAlreadyExistsError)
export class ConflictFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    response.status(409).json({
      statusCode: 409,
      message: exception.message,
    });
  }
}
