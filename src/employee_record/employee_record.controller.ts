import { Controller, Get, Req, Res, Query, UseGuards } from '@nestjs/common';
import { EmployeeRecordService } from './employee_record.service';
import { Request, Response } from 'express';
import { UserRolesGuard } from 'src/common/guards/user_role.guard';
import { AllAdminRolesGuard } from 'src/common/guards/all_admin_role.guard';
import { getAllRecordsDto } from './dto/create-employee_record.dto';
import { PaginationQueries } from 'src/common/global/dto/global.dto';

@Controller('employee-record')
export class EmployeeRecordController {
  constructor(private readonly employeeRecordService: EmployeeRecordService) {}
  // _________________________________________________________________

  @UseGuards(UserRolesGuard)
  @Get()
  getRecords(@Req() req: Request, @Res() res: Response, @Query() query: any) {
    return this.employeeRecordService.getRecords(req, res, query);
  }
  // _________________________________________________________________

  @UseGuards(UserRolesGuard)
  @Get('logs')
  getLogs(
    @Req() req: Request,
    @Res() res: Response,
    @Query() query: PaginationQueries,
  ) {
    return this.employeeRecordService.geMytLogs(req, res, query);
  }
  // _________________________________________________________________

  @UseGuards(AllAdminRolesGuard)
  @Get('all')
  getAllRecords(
    @Req() req: Request,
    @Res() res: Response,
    @Query() query: getAllRecordsDto,
  ) {
    return this.employeeRecordService.getAllRecords(req, res, query);
  }
}
