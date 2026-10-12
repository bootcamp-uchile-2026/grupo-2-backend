import {CallHandler,ExecutionContext,Injectable,NestInterceptor} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const requestId = request.headers['x-request-id'];
    const startTime = Date.now();

    response.once('finish', () => {
      console.log({
        requestId,
        method: request.method,
        url: request.originalUrl,
        statusCode: response.statusCode,
        durationMs: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      });
    });

    return next.handle();
  }
}
