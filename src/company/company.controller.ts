import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { Request, Response } from 'express';
import { SuperAdminRolesGuard } from 'src/common/guards/super_admin_role.guard';
import { AllAdminRolesGuard } from 'src/common/guards/all_admin_role.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/config/multer.config';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}
  // _________________________________________________________________

  @UseGuards(SuperAdminRolesGuard)
  @Post()
  create(
    @Body() createCompanyDto: CreateCompanyDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.companyService.create(req, res, createCompanyDto);
  }
  // _________________________________________________________________

  @UseGuards(AllAdminRolesGuard)
  @Get()
  get(@Req() req: Request, @Res() res: Response) {
    return this.companyService.getInfo(req, res);
  }
  // _________________________________________________________________
  @Post('logo')
  @UseInterceptors(FileInterceptor('file', multerOptions.Company))
  async upload(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10000000 }), // 10MB max size
          new FileTypeValidator({
            fileType: /^image\/(jpeg|png|gif|jpg)$/i,
          }),
        ],
      }),
    )
    file: any,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.companyService.uploadLogo(file, req, res);
  }
  // _________________________________________________________________

  @Delete('logo')
  removeLogo(@Req() req: Request, @Res() res: Response) {
    return this.companyService.removeLogo(req, res);
  }
}
