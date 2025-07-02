import {
    Catch,
    ExceptionFilter,
    ArgumentsHost,
    HttpException,
} from '@nestjs/common'
import { Response } from 'express'
import { CustomException } from './custum-error'
import fsExtra from 'fs-extra'

export let removePic = async (myPath) => {
    if (await fsExtra.pathExists(myPath)) {
        await fsExtra.remove(myPath)
    }
}

@Catch(CustomException)
export class HttpExceptionFilter implements ExceptionFilter {
    async catch(exception: CustomException, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse<Response>()
        const request = ctx.getRequest<Request>()
        const status = exception.getStatus() || 400

        // if (request.file && (await fsExtra.pathExists(request.file.path))) {
        //   try {
        //     await removePic(request.file.path);
        //   } catch (error) {}
        // }

        response.status(status).json({
            status_code: status,
            error_code: exception.errorCode,
            message: exception.message,
        })
    }
}
