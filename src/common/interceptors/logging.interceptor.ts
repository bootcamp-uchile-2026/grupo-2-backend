import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap, finalize } from 'rxjs';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const requestId = request.headers['x-request-id'];
    const method = request.method;
    const url = request.originalUrl;
    const startTime = Date.now();

    let statusCode = response.statusCode;

    return next.handle().pipe(
      tap({
        error: (error: unknown) => {
          statusCode =
            error instanceof HttpException
              ? error.getStatus()
              : 500;
        },
      }),
      finalize(() => {
        console.log({
          requestId,
          method,
          url,
          statusCode,
          durationMs: Date.now() - startTime,
          timestamp: new Date().toISOString(),
        });
      }),
    );
  }
}