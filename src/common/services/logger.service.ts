import { Injectable } from '@nestjs/common';
import { logger } from '../../config/winston.config';
import { Request } from 'express';

@Injectable()
export class LoggerService {
  log(data: any, context?: string, req?: Request) {
    delete req?.headers.authorization;
    logger.log('info', data, {
      ip: req?.ip,
      file: __filename,
      url: req?.url,
      base_url: req?.baseUrl,
      timestamp: new Date().toISOString(),
      headers: req?.headers,
      statusCode: req?.statusCode,
      re: req?.method,
      req: req?.params,
      query: req?.query,
      route: req?.route,
      secure: req?.secure,
      statusMessage: req?.statusMessage,
      // useragent: req?.useragent,
      context,
    });
  }

  error(message: string[], status: number, context?: any) {
    logger.log('error', {
      status,
      message,
      file_after_deploy: __filename,
      timestamp: new Date().toISOString(),
      context,
    });
  }

  warn(message: string, context?: string) {
    logger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    logger.debug(message, { context });
  }
}
