import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "src/user/entities/user.entity";
import { RefreshToken } from "src/user/entities/refresh_token.entity";
import { UserPermission } from "src/user/entities/user_permission.entity";
import { JWTService } from "src/common/services/jwt.services";
import { RedisService } from "src/common/services/redis.service";
import { EmailService } from "src/common/services/sendEmail";
import { UuidService } from "src/common/services/uuid.service";
import { RolePermission } from "src/role/entities/roles_permissions.entity";
import { Language } from "src/languages/entities/language.entity";
import { Permission } from "src/permission/entities/permission.entity";
import { Role } from "src/role/entities/role.entity";
import { EncryptionService } from "src/common/services/encrypt.service";

@Module({
  imports: [
    SequelizeModule.forFeature([
      User,
      RefreshToken,
      UserPermission,
      RolePermission,
      Permission,
      Language,
      Role,
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JWTService,
    RedisService,
    EmailService,
    UuidService,
    EncryptionService,
  ],
})
export class AuthModule {}
