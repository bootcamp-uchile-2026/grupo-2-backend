import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { DuplicateEmailError } from '../errors/duplicate-email.error';
import { FavoriteAlreadyExistsError } from '../errors/favorite-already-exists.error';
import { EmptyCartError } from '../errors/empty-cart.error';
import { InsufficientStockError } from '../errors/insufficient-stock.error';
import { InsufficientGreenPointsError } from '../errors/insufficient-green-points.error';
import { CheckoutTotalChangedError } from '../errors/checkout-total-changed.error';
import { InvalidOrderStatusError } from '../errors/invalid-order-status.error';
import { ReviewAlreadyExistsError } from '../errors/review-already-exists.error';
import { ReviewNotAllowedError } from '../errors/review-not-allowed.error';
import { InvalidReturnError } from '../errors/invalid-return.error';
import { InvalidReturnStatusError } from '../errors/invalid-return-status.error';
import { InvalidProductError } from '../errors/invalid-product.error';

@Catch(
  DuplicateEmailError,
  FavoriteAlreadyExistsError,
  EmptyCartError,
  InsufficientStockError,
  InsufficientGreenPointsError,
  InvalidOrderStatusError,
  CheckoutTotalChangedError,
  ReviewAlreadyExistsError,
  ReviewNotAllowedError,
  InvalidReturnError,
  InvalidReturnStatusError,
  QueryFailedError,
  InvalidProductError
)
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

        } else if (error.constraint === 'uq_reviews_customer_product') {
          exception = new ReviewAlreadyExistsError();
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