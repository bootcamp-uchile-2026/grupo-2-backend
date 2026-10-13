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

    let bodyRegistrado = 'Sin body';

    if (req.body && typeof req.body === 'object') {
      bodyRegistrado = JSON.stringify(Object.keys(req.body));
    }

    res.once('finish', () => {
      console.log({
        requestId: requestId,
        method: req.method,
        url: req.originalUrl,
        body: bodyRegistrado,
        statusCode: res.statusCode,
        durationMs: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      });
    });

    next();
  }
}
