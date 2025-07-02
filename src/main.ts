import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import * as compression from 'compression';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/constant/http-exception-filter';
import * as useragent from 'express-useragent';
import { IoAdapter } from '@nestjs/platform-socket.io';
import * as path from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { DefaultDataService } from './default-data.service';
dotenv.config({ path: './.env' });
import { welcomeLog } from './common/utilis/helper';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: false,
  });

  app.use(compression({ encodings: ['gzip', 'deflate'] }));
  app.use(useragent.express());
  let uploadsPath = path.resolve(__dirname, '..', 'uploads');
  app.useStaticAssets(uploadsPath, {
    prefix: '/uploads',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      // -----------------------------------------------
      // this for changing HttpStatusCode returned
      // errorHttpStatusCode: 403,
      // -----------------------------------------------
      // this for stop ErrorMessages returned
      // disableErrorMessages: true,
      // -----------------------------------------------
      // for make custom message
      // dismissDefaultMessages: true,
      // -----------------------------------------------
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  let io = new IoAdapter(app);
  app.useWebSocketAdapter(io);
  const adminUiPath = join('./node_modules/@socket.io/admin-ui/ui/dist');
  app.use('/', express.static(adminUiPath));
  // ! default data
  const defaultDataService = app.get(DefaultDataService);
  await defaultDataService.insertDefaultData();
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(process.env.PORT, () => {
    welcomeLog(process.env.PORT as string);
  });
}
bootstrap();
