import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  use(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const requestId = randomUUID();
    req.headers['x-request-id'] = requestId;
    const startTime = Date.now();

    // Identificador único para la solicitud

    res.setHeader('X-Request-ID', requestId);

    console.log({ 
      requestId, 
      method: req.method, 
      url: req.originalUrl, 
      receivedAt: new Date().toISOString() 
    });

    console.log(`Request ID: ${requestId} - ${req.method} ${req.originalUrl}`);

    // Registrar el resultado cuando termina la respuesta
    
    res.on('finish', () => {
      console.log({
        requestId,
        statusCode: res.statusCode,
        durationMs: Date.now() - startTime,
      });
    });
    
    next();
  }
}
