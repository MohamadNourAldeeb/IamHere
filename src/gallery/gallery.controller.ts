import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
    ParseFilePipe,
    MaxFileSizeValidator,
    FileTypeValidator,
    Req,
    Res,
    Delete,
    Param,
    Get,
    UseGuards,
} from '@nestjs/common'
import { GalleryService } from './gallery.service'
import { Request, Response } from 'express'
import { FileInterceptor } from '@nestjs/platform-express'
import { IdDto } from './dto/id-dto'
import { AuthorizationGuard } from 'src/common/guards/authorization.guard'
import { permissions } from 'src/common/constant/permissions'
import { Permissions } from 'src/common/decorators/permission.decorator'
import { ApiKeyGuard } from 'src/common/guards/apiKey.guard'
@UseGuards(ApiKeyGuard)
// @UseGuards(AuthorizationGuard)
@Controller('gallery')
export class GalleryController {
    constructor(private readonly galleryService: GalleryService) {}
    // @Permissions([permissions.gallery.upload.value])
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async upload(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 50000000 }), // 50MB max size
                    new FileTypeValidator({
                        // Videos , Image , Pdf
                        fileType:
                            // /^image\/(jpeg|png|gif)$|^video\/(mp4|mov)$|application\/pdf$/,
                            /^image\/(jpeg|png|gif)$/,
                    }),
                ],
            })
            // asd
        ) // file: Express.Multer.File,
        files,
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response
    ) {
        await this.galleryService.upload(files, req, res)
    }

    // @Permissions([permissions.gallery.delete.value])
    @Delete(':id')
    async remove(
        @Param('id') id: string,
        @Req() req: Request,
        @Res() res: Response
    ) {
        return await this.galleryService.remove(+id, req, res)
    }
    // @Permissions([permissions.gallery.getAll.value])
    @Get()
    async findAll(@Req() req: Request, @Res() res: Response) {
        return await this.galleryService.findAll(req, res)
    }
}
