import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface'
export const corsOptions: CorsOptions = {
    origin: [process.env.CLIENT_LINK, 'http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}
