import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { QrService } from './qr.service';
import { Request, Response } from 'express';
import { ApiKeyGuard } from 'src/common/guards/apiKey.guard';
import { AllAdminRolesGuard } from 'src/common/guards/all_admin_role.guard';
import { UserRolesGuard } from 'src/common/guards/user_role.guard';

@UseGuards(ApiKeyGuard)
@Controller('qr')
export class QrController {
  constructor(private readonly qrService: QrService) {}
  // _________________________________________________________________
  @UseGuards(AllAdminRolesGuard)
  @Get()
  generateQR(@Req() req: Request, @Res() res: Response) {
    return this.qrService.generateQR(req, res);
  }
  // _________________________________________________________________
  @UseGuards(UserRolesGuard)
  @Post()
  scan(@Req() req: Request, @Res() res: Response, @Body() body: any) {
    return this.qrService.scan(req, res, body);
  }
}
