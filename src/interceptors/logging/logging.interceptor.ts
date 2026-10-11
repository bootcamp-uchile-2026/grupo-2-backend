import { CallHandler, ExecutionContext, HttpException, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();

    const requestId = req.headers['x-request-id'];
    const inicio = Date.now();

    const fecha = new Date().toISOString();

    console.log(`[${requestId}] ${fecha} | ${req.method} ${req.originalUrl}`);

    return next.handle().pipe(
      tap(() => {
        const duracion = Date.now() - inicio;

        console.log(
          `[${requestId}] HTTP ${res.statusCode} | ${duracion} ms`
        );
      }),

      catchError((error: unknown) => {
        const duracion = Date.now() - inicio;

        const statusCode = error instanceof HttpException ? error.getStatus() : 500;

        console.log(
          `[${requestId}] HTTP ${statusCode} | ${duracion} ms`
        );

        return throwError(() => error);
      })
    );
  }
}