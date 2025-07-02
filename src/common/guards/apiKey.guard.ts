import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { Observable } from 'rxjs';
import { CustomException } from '../constant/custum-error';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    let api_key =
      request.headers.api_key ||
      request.headers['api-key'] ||
      request.headers['Api-Key'] ||
      request.headers['API-KEY'] ||
      request.headers['x-api-key'];

    if (api_key && api_key === process.env.API_KEY) {
      return true;
    }

    throw new CustomException('Access denied', undefined, 401);
  }
}
