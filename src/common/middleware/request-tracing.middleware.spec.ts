import { RequestTracingMiddleware } from './request-tracing.middleware';

describe('RequestTracingMiddleware', () => {
  it('should be defined', () => {
    expect(new RequestTracingMiddleware()).toBeDefined();
  });
});
