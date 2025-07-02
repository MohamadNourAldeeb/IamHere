import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { RefreshToken } from './entities/refresh_token.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { EmailService } from 'src/common/services/sendEmail';
import { Permission } from '../permission/entities/permission.entity';
import { Role } from '../role/entities/role.entity';
import { UserPermission } from './entities/user_permission.entity';
import { RolePermission } from '../role/entities/roles_permissions.entity';

import { ActivityLogs } from './entities/activity_log.entity';
import { ValidationDtoService } from 'src/common/services/validationService';
import { Language } from 'src/languages/entities/language.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([
      User,
      RefreshToken,
      Permission,
      Role,
      UserPermission,
      RolePermission,
      ActivityLogs,
      Language,
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, EmailService, ValidationDtoService],
})
export class UserModule {}
