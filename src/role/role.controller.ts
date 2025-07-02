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
} from '@nestjs/common'
import { RoleService } from './role.service'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { Request, Response } from 'express'
import { ApiKeyGuard } from 'src/common/guards/apiKey.guard'
@UseGuards(ApiKeyGuard)
@Controller('role')
export class RoleController {
    constructor(private readonly roleService: RoleService) {}

    @Post()
    create(
        @Body() createRoleDto: CreateRoleDto,
        @Req() req: Request,
        @Res() res: Response
    ) {
        return this.roleService.create(createRoleDto, req, res)
    }

    @Get()
    findAll(@Req() req: Request, @Res() res: Response) {
        return this.roleService.findAll(req, res)
    }

    @Put(':id')
    update(
        @Param('id') id: string,
        @Body() updateRoleDto: UpdateRoleDto,
        @Req() req: Request,
        @Res() res: Response
    ) {
        return this.roleService.update(+id, updateRoleDto, req, res)
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
        return this.roleService.remove(+id, req, res)
    }
}
