import {ArgumentsHost, Catch, ExceptionFilter, HttpException, Injectable} from '@nestjs/common';

@Catch(HttpException)
@Injectable()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) 
  {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const request = context.getRequest();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    response.status(status).json(
      {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exceptionResponse,
      }
    );
  }
}