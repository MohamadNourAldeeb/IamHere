import { Module } from "@nestjs/common";
import { QrService } from "./qr.service";
import { QrController } from "./qr.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { EmployeeRecord } from "src/employee_record/entities/employee_record.entity";
import { RedisService } from "src/common/services/redis.service";
import { EncryptionService } from "src/common/services/encrypt.service";
import { IpService } from "src/common/services/ip.service";

@Module({
    imports: [SequelizeModule.forFeature([EmployeeRecord])],
    controllers: [QrController],
    providers: [QrService, RedisService, EncryptionService, IpService],
})
export class QrModule {}
