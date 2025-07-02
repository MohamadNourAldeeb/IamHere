import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { sendHttpResponse } from 'src/common/services/request.service';
import { Language } from './entities/language.entity';
import { InjectModel } from '@nestjs/sequelize';
import { Request, Response } from 'express';

@Injectable()
export class LanguagesService {
  constructor(
    @InjectModel(Language)
    private LanguageRepository: typeof Language,
  ) {}
  create(createLanguageDto: CreateLanguageDto) {
    return 'This action adds a new language';
  }

  async findAll(req: Request, res: Response) {
    let data: any = await this.LanguageRepository.findAll({
      raw: true,
      attributes: { exclude: ['id', 'createdAt', 'updatedAt'] },
    });
    sendHttpResponse(res, HttpStatus.OK, data);
  }

  update(id: number, updateLanguageDto: UpdateLanguageDto) {
    return `This action updates a #${id} language`;
  }

  remove(id: number) {
    return `This action removes a #${id} language`;
  }
}
