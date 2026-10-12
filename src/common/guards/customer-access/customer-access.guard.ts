import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class CustomerAccessGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> 
  {
    const request = context.switchToHttp().getRequest();
    const customerApiKey = request.headers['x-api-key'];

    if (!process.env.CUSTOMER_API_KEY || customerApiKey !== process.env.CUSTOMER_API_KEY) {
      throw new ForbiddenException('Acceso denegado');
    }
    
    return true;
  }
}
