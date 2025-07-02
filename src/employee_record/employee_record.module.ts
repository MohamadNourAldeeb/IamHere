import { Module } from '@nestjs/common';
import { EmployeeRecordService } from './employee_record.service';
import { EmployeeRecordController } from './employee_record.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { EmployeeRecord } from './entities/employee_record.entity';
import { User } from 'src/user/entities/user.entity';
import { Company } from 'src/company/entities/company.entity';

@Module({
  imports: [SequelizeModule.forFeature([EmployeeRecord, User, Company])],
  controllers: [EmployeeRecordController],
  providers: [EmployeeRecordService],
})
export class EmployeeRecordModule {}
