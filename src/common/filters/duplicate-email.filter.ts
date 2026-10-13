import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { DuplicateEmailError } from '../errors/duplicate-email.error';

@Catch(DuplicateEmailError)
export class DuplicateEmailFilter implements ExceptionFilter {
  catch(exception: DuplicateEmailError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    response.status(409).json({
      statusCode: 409,
      message: exception.message,
    });
  }
}