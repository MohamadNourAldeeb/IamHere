import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { LanguagesService } from './languages.service';
import { ApiKeyGuard } from 'src/common/guards/apiKey.guard';
import { Request, Response } from 'express';
@UseGuards(ApiKeyGuard)
@Controller('languages')
export class LanguagesController {
  constructor(private readonly languagesService: LanguagesService) {}
  // _________________________________________________________________

  @Get()
  findAll(@Req() req: Request, @Res() res: Response) {
    return this.languagesService.findAll(req, res);
  }
}
