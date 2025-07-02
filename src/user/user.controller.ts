import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
  Put,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request, Response } from 'express';
import { ApiKeyGuard } from 'src/common/guards/apiKey.guard';
import { PaginationWithSearchQueries } from 'src/common/global/dto/global.dto';
import { AllAdminRolesGuard } from 'src/common/guards/all_admin_role.guard';
import { SuperAdminRolesGuard } from 'src/common/guards/super_admin_role.guard';
@UseGuards(ApiKeyGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  // _________________________________________________________________
  @UseGuards(AllAdminRolesGuard)
  @Post()
  create(
    @Body() createUserDto: CreateUserDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.userService.create(req, res, createUserDto);
  }

  // _________________________________________________________________
  @UseGuards(AllAdminRolesGuard)
  @Get()
  findAll(
    @Req() req: Request,
    @Res() res: Response,
    @Query() query: PaginationWithSearchQueries,
  ) {
    return this.userService.findAll(req, res, query);
  }

  // _________________________________________________________________
  @UseGuards(SuperAdminRolesGuard)
  @Get('activity-log')
  findAllActivityLog(@Req() req: Request, @Res() res: Response) {
    return this.userService.findAllActivityLog(req, res);
  }

  // _________________________________________________________________
  @UseGuards(AllAdminRolesGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.userService.update(+id, updateUserDto, req, res);
  }

  // _________________________________________________________________
  @UseGuards(AllAdminRolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
    return this.userService.remove(+id, req, res);
  }
}
