import { HttpStatus, Injectable } from "@nestjs/common";
import { Request, Response } from "express";
import { Gallery } from "./entities/gallery.entity";
import { InjectConnection, InjectModel } from "@nestjs/sequelize";
import { CustomException } from "src/common/constant/custum-error";
import { removePic } from "src/common/constant/http-exception-filter";

import * as path from "path";
import { ActivityLogs } from "src/user/entities/activity_log.entity";
import { Sequelize } from "sequelize-typescript";
import { ValidationDtoService } from "src/common/services/validationService";
import { FindAllActivityLogsDto } from "src/user/dto/find-all-articles.dto";

@Injectable()
//
export class GalleryService {
  constructor(
    @InjectModel(Gallery)
    private galleryRepository: typeof Gallery,
    @InjectConnection() private sequelizeConnection: Sequelize,
    private readonly ValidationService: ValidationDtoService
  ) {}

  async upload(file: any, req: Request, res: Response) {
    await this.sequelizeConnection.transaction(async (transaction: any) => {
      await this.galleryRepository.create({
        file_name: file.filename,
        base_name: file.originalname,
        created_by: req.user.id,
      });
    });

    return res.status(HttpStatus.OK).send({
      success: true,
      data: {
        message: "operation accomplished successfully",
      },
    });
  }

  async remove(id: number, req: Request, res: Response) {
    let errorMessage =
      "Cannot remove this image as it's linked to the article. Please detach it first";

    let file = await this.galleryRepository.findOne({
      raw: true,
      attributes: ["file_name", "id"],
      where: {
        id,
      },
    });
    if (!file) throw new CustomException("Id is incorrect");

    let filePath = path.resolve(__dirname, "../../uploads", file.file_name);
    try {
      await removePic(filePath);
    } catch (error) {}
    await this.sequelizeConnection.transaction(async (transaction: any) => {
      await this.galleryRepository.destroy({ where: { id }, transaction });
    });

    return res.status(HttpStatus.OK).send({
      success: true,
      data: {
        message: "operation accomplished successfully",
      },
    });
  }

  async findAll(req: Request, res: Response) {
    let query = {
      page: +req.query.page,
      size: +req.query.size,
    };

    try {
      // ! Validation section
      await this.ValidationService.validationDto(FindAllActivityLogsDto, query);
    } catch (error) {
      let errorMessage = "";
      if (error && error[0].constraints) {
        let errors = error[0].constraints;

        if (errors) errorMessage = Object.values(errors).join(", ");
        throw new CustomException(errorMessage);
      } else if (error) {
        throw new CustomException(
          "some fields is not correct validation error"
        );
      }
    }

    let { count, rows } = await this.galleryRepository.findAndCountAll({
      raw: true,
      offset: (+query.page - 1) * +query.size,
      limit: +query.size,
    });

    let files = rows.map((file: Gallery) => {
      return {
        id: file.id,
        base_name: file.base_name,
        link: process.env.LINK + "/uploads/" + file.file_name,
      };
    });

    const total = count;
    const perPage = query.size;
    const lastPage = Math.ceil(total / perPage);
    return res.status(HttpStatus.OK).send({
      success: true,
      data: {
        records: files,
        total: total,
        per_page: perPage,
        last_page: lastPage,
      },
    });
  }
}
