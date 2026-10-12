import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { finalize, tap, Observable } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const requestId = request.headers['x-request-id'] || 'N/A';
    const method = request.method;
    const url = request.url;
    const startTime = Date.now();

    console.log({
      requestId,
      method,
      url,
      message: 'Solicitud recibida',
      timestamp: new Date().toISOString(),
    })

    return next.handle().pipe(

      // Registro de errores en caso de que ocurra alguno durante la ejecución del controlador
      tap({
        error: (error) => {
          console.error({
            requestId,
            error: error.message,
          });
        },
      }),
      
      // Registro de la respuesta y el tiempo de ejecución una vez que la solicitud ha sido procesada
      finalize(() => {
        console.log({
          requestId,
          method,
          url,
          statusCode: response.statusCode,
          duration: Date.now() - startTime,
          timestamp: new Date().toISOString(),
        });
      }),

    );
  }
}
