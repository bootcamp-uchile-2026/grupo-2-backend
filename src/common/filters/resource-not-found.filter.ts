import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { EntrepreneurNotFoundError } from '../errors/entrepreneur-not-found.error';
import { ProductNotFoundError } from '../errors/product-not-found.error';
import { SubcategoryNotFoundError } from '../errors/subcategory-not-found.error';

@Catch(EntrepreneurNotFoundError, ProductNotFoundError, SubcategoryNotFoundError)
export class ResourceNotFoundFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    response.status(404).json({
      statusCode: 404,
      message: exception.message,
    });
  }
}
