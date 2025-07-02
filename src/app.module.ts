import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { databaseConfig } from './config/database.config';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { JWTService } from './common/services/jwt.services';
import { authenticationMiddleware } from './common/middlewares/authentication.middleware';
import { RateLimitMiddleware } from './common/middlewares/rate-limit.middleware';
import { RefreshToken } from './user/entities/refresh_token.entity';
import { User } from './user/entities/user.entity';
import { Role } from './role/entities/role.entity';
import { Permission } from './permission/entities/permission.entity';
import { ActivityLogs } from './user/entities/activity_log.entity';
import { Gallery } from './gallery/entities/gallery.entity';
import { UserPermission } from './user/entities/user_permission.entity';
import { RolePermission } from './role/entities/roles_permissions.entity';
import { RedisService } from './common/services/redis.service';
import { EmployeeRecordModule } from './employee_record/employee_record.module';
import { EmployeeRecord } from './employee_record/entities/employee_record.entity';
import { QrModule } from './qr/qr.module';
import { Language } from './languages/entities/language.entity';
import { AuthModule } from './auth/auth.module';
import { DefaultDataService } from './default-data.service';
import { UserModule } from './user/user.module';
import { CompanyModule } from './company/company.module';
import { Company } from './company/entities/company.entity';
import { initializeDatabase } from './common/utilis/database.utils';
import { BackupService } from './common/services/backup.service';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        // Initialize the database if it doesn't exist
        await initializeDatabase(configService);
        return {
          dialect: 'mysql',
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USER'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_NAME'),
          logging: false,
          timezone: '+03:00',
          dialectOptions: {
            dateStrings: true,
            typeCast: true,
          },
          synchronize: true,
          autoLoadModels: true,
        };
      },
      inject: [ConfigService],
    }),
    JwtModule.register({ global: true }),
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        secure: true,
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
    }),

    SequelizeModule.forFeature([
      RefreshToken,
      User,
      Role,
      Permission,
      ActivityLogs,
      Gallery,
      UserPermission,
      RolePermission,
      EmployeeRecord,
      Language,
      Company,
    ]),
    QrModule,
    AuthModule,
    UserModule,
    EmployeeRecordModule,
    CompanyModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JWTService,
    RedisService,
    DefaultDataService,
    BackupService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    const excludedPaths = [
      { path: '/auth/sign-in', method: RequestMethod.ALL },
      { path: '/auth/refresh-token', method: RequestMethod.POST },
      { path: '/auth/register', method: RequestMethod.ALL },
      { path: '/auth/verification', method: RequestMethod.ALL },
      { path: '/auth/send-code', method: RequestMethod.ALL },
      { path: '/uploads', method: RequestMethod.GET },
      { path: '/', method: RequestMethod.GET },
      { path: '/qr', method: RequestMethod.GET },
    ];

    consumer
      .apply(authenticationMiddleware)
      .exclude(...excludedPaths)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
    // ! Apply RateLimitMiddleware first
    consumer
      .apply(RateLimitMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL }); // Apply to /auth/* to cover sub-routes as well
  }
}
