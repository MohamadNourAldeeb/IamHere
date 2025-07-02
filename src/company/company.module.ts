import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Company } from './entities/company.entity';
import { User } from 'src/user/entities/user.entity';
import { Language } from 'src/languages/entities/language.entity';

@Module({
  controllers: [CompanyController],
  providers: [CompanyService],
  imports: [SequelizeModule.forFeature([Company, User, Language])],
})
export class CompanyModule {}
