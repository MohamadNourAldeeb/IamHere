import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { signInDto } from './dto/signInDto';
import { RefreshTokenDto } from './dto/RefreshTokenDto';
import { changePassDto } from './dto/changePassDto';
import { ApiKeyGuard } from 'src/common/guards/apiKey.guard';
import { registerDto } from './dto/registerDto';
@UseGuards(ApiKeyGuard)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-in')
  @HttpCode(200)
  signIn(
    @Body() signInDto: signInDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.authService.signIn(req, res, signInDto);
  }

  @Post('register')
  @HttpCode(200)
  register(
    @Body() registerDto: registerDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.authService.register(req, res, registerDto);
  }

  @Post('refresh-token')
  @HttpCode(200)
  refreshToken(
    @Body() body: RefreshTokenDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.authService.refreshToken(req, res, body);
  }
  @Post('change-pass')
  @HttpCode(200)
  changePassword(
    @Body() body: changePassDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.authService.changePass(req, res, body);
  }

  @Get('sign-out')
  @HttpCode(200)
  logOut(@Req() req: Request, @Res() res: Response) {
    return this.authService.logOut(req, res);
  }
}
