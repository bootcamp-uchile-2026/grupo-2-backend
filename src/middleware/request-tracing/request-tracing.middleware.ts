import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { randomUUID } from 'crypto';

@Injectable()
export class RequestTracingMiddleware implements NestMiddleware {

  use(req: Request, res: Response, next: () => void) {

    const requestId = randomUUID();

    req.headers['x-request-id'] = requestId;

    res.setHeader('x-request-id', requestId);

    next();
  }
}
