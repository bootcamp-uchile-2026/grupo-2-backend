import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { CustomerNotFoundError } from '../errors/customer-not-found.error';
import { ProducerNotFoundError } from '../errors/producer-not-found.error';
import { ProductNotFoundError } from '../errors/product-not-found.error';
import { ArticleNotFoundError } from '../errors/article-not-found.error';
import { CategoryNotFoundError } from '../errors/category-not-found.error';
import { FavoriteNotFoundError } from '../errors/favorite-not-found.error';
import { CartNotFoundError } from '../errors/cart-not-found.error';
import { CartItemNotFoundError } from '../errors/cart-item-not-found.error';

@Catch(
  CustomerNotFoundError,
  ProducerNotFoundError,
  ProductNotFoundError,
  ArticleNotFoundError,
  CategoryNotFoundError,
  FavoriteNotFoundError,
  CartNotFoundError,
  CartItemNotFoundError,
)
export class ResourceNotFoundFilter implements ExceptionFilter {

  catch(exception: Error, host: ArgumentsHost) {

    const response =
      host.switchToHttp().getResponse<Response>();

    response.status(404).json({
      statusCode: 404,
      message: exception.message,
    });
  }
}