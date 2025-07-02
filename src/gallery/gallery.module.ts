import { Module } from '@nestjs/common';
import { GalleryService } from './gallery.service';
// import { GalleryController } from './gallery.controller';
import { MulterModule } from '@nestjs/platform-express';
import { multerOptions } from 'src/config/multer.config';
import { GalleryController } from './gallery.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Gallery } from './entities/gallery.entity';
import { ValidationDtoService } from 'src/common/services/validationService';

@Module({
  imports: [
    MulterModule.register({
      storage: multerOptions.public,
      // limits: {
      //set the limited size ,measure bytes 1M byte=1e6
      //   fileSize: 100 * 1024 * 1024,
      // },
    }),
    SequelizeModule.forFeature([Gallery]),
  ],
  controllers: [GalleryController],
  providers: [GalleryService, ValidationDtoService],
})
export class GalleryModule {}
