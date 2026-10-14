import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { CustomerNotFoundError } from '../errors/customer-not-found.error';
import { EntrepreneurNotFoundError } from '../errors/entrepreneur-not-found.error';
import { ProductNotFoundError } from '../errors/product-not-found.error';
import { SubcategoryNotFoundError } from '../errors/subcategory-not-found.error';
import { ArticleNotFoundError } from '../errors/article-not-found.error';

@Catch(CustomerNotFoundError,EntrepreneurNotFoundError,ProductNotFoundError,SubcategoryNotFoundError,ArticleNotFoundError)

export class ResourceNotFoundFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    response.status(404).json({
      statusCode: 404,
      message: exception.message,
    });
  }
}