import {
  HttpStatus,
  Inject,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CustomException } from '../constant/custum-error';

import { Redis } from 'ioredis';
import { RefreshToken } from 'src/user/entities/refresh_token.entity';
import { InjectModel } from '@nestjs/sequelize';
import { JWTService } from '../services/jwt.services';
import { RedisService } from '../services/redis.service';

declare global {
  namespace Express {
    export interface Request {
      user?: {
        email: string;
        id: number;
        lang_id: number;
        role_id: number;
        user_name: string;
        device_serial: string;
        device_type: string;
      };
    }
  }
}
@Injectable()
export class authenticationMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtServices: JWTService,
    @InjectModel(RefreshToken)
    private refreshTokenRepository: typeof RefreshToken,
    private readonly redisService: RedisService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      let rawToken: any =
        req.headers.authorization || req.headers.Authorization;
      if (!rawToken)
        throw new CustomException(
          ' 😊  Token not exists, please set token and  try again ',
        );

      if (rawToken.startsWith('Bearer '))
        rawToken = rawToken.replace('Bearer ', '');

      let decoded: any = await this.jwtServices.verifyToken(
        rawToken,
        process.env.TOKEN_SECRET_KEY as string,
      );

      if (!decoded)
        throw new CustomException('  🤨 bad token ', HttpStatus.UNAUTHORIZED);
      const isLogOut: any = await this.refreshTokenRepository.findOne({
        raw: true,
        where: { user_id: decoded.id, device_serial: decoded.device_serial },
      });

      if (!isLogOut)
        throw new CustomException(
          '  🤨You have logged out',
          HttpStatus.UNAUTHORIZED,
        );

      const storedJti: string | null =
        await this.redisService.getFromRedisCache(`${isLogOut.id}`);

      if (decoded.jti != storedJti)
        throw new CustomException(
          'your token is old or forbidden please login again ',
          HttpStatus.UNAUTHORIZED,
        );

      if (decoded.device_serial != isLogOut.device_serial)
        throw new CustomException(
          'This token is not for your device , from where you get it ',
          HttpStatus.UNAUTHORIZED,
        );

      req.user = {
        id: decoded.id,
        user_name: decoded.user_name,
        role_id: decoded.role_id,
        lang_id: decoded.lang_id,
        email: decoded.email,
        device_serial: decoded.device_serial,
        device_type: decoded.device_type,
      };
      return next();
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
  }
}
