import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CustomException } from '../constant/custum-error';

@Injectable()
export class UserRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    if (request.user && request.user.role_id === 3) {
      return true;
    } else {
      throw new CustomException(
        'Access denied this api just for user',
        undefined,
        403,
      );
    }
  }
}
