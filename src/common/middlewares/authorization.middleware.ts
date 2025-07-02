import {
    Injectable,
    NestMiddleware,
    UnauthorizedException,
} from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'

@Injectable()
export class authorizationMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        // const role = req.body.role;
        // console.log(req.user);
        // if (role === 'admin') {
        //   console.log(' your role is  :admin');
        // } else if (role === 'user') {
        //   console.log('user');
        // }
        // // console.log(`Executing middleware in path ${req.path} the body `, req.body);
        // if (req.body.type == false) throw new UnauthorizedException('dddd');
        // console.log('authorizationMiddleware');
        // console.log(req.headers);

        return next()
    }
}
