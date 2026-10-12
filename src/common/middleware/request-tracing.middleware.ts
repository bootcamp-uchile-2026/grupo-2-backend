import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { randomUUID } from 'node:crypto';

@Injectable()
export class RequestTracingMiddleware implements NestMiddleware {

  use(req: Request, res: Response, next: () => void): void {
    const requestId = randomUUID();
    const startTime = Date.now();

    req.headers['x-request-id'] = requestId;
    res.setHeader('x-request-id', requestId);

    res.once('finish', () => {
      console.log({
        requestId,
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        durationMs: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      });
    });

    next();
  }
}
