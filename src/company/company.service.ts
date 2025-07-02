import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { Request, Response } from 'express';
import { sendHttpResponse } from 'src/common/services/request.service';
import { CustomException } from 'src/common/constant/custum-error';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { User } from 'src/user/entities/user.entity';
import { Language } from 'src/languages/entities/language.entity';
import { Sequelize } from 'sequelize-typescript';
import { Company } from './entities/company.entity';
import { Op } from 'sequelize';
import * as moment from 'moment';
@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(User)
    private userRepository: typeof User,
    @InjectModel(Company)
    private companyRepository: typeof Company,

    @InjectModel(Language)
    private languageRepository: typeof Language,
    @InjectConnection() private sequelizeConnection: Sequelize,
  ) {}
  // _________________________________________________________________
  /**
   *
   * @param req
   * @param res
   * @param body
   */
  async create(req: Request, res: Response, body: CreateCompanyDto) {
    let adminData: any = await this.userRepository.findOne({
      raw: true,
      where: { id: req.user.id, role_id: 1 },
    });

    if (!adminData) throw new CustomException('You are not admin');

    const startMoment = moment(body.start_work_at, 'HH:mm:ss');
    const endMoment = moment(body.end_work_at, 'HH:mm:ss');
    let diffMs = endMoment.diff(startMoment);
    if (diffMs < 0) {
      diffMs += 24 * 60 * 60 * 1000;
    }
    const diffHours = diffMs / (60 * 60 * 1000);

    if (body.work_hours > diffHours)
      throw new CustomException(
        'you should send work hours small than the work  hours ',
      );
    if (
      body.user_name &&
      (await this.userRepository.findOne({
        raw: true,
        where: { id: { [Op.not]: req.user.id }, user_name: body.user_name },
      }))
    )
      throw new CustomException('the user name is already exist');
    if (
      body.email &&
      (await this.userRepository.findOne({
        raw: true,
        where: { id: { [Op.not]: req.user.id }, email: body.email },
      }))
    )
      throw new CustomException('the email is already exist');
    if (
      body.phone_number &&
      (await this.userRepository.findOne({
        raw: true,
        where: {
          id: { [Op.not]: req.user.id },
          phone_number: body.phone_number,
        },
      }))
    )
      throw new CustomException('the phone number is already exist');
    let companyData: any = await this.companyRepository.findOne({
      raw: true,
      where: { id: adminData.company_id },
    });

    await this.sequelizeConnection.transaction(async (transaction: any) => {
      await this.companyRepository.update(
        {
          name: body.company_name,
          work_hours: body.work_hours,
          start_work_at: body.start_work_at,
          end_work_at: body.end_work_at,
          colors: body.colors,
        },
        { where: { id: companyData.id }, transaction },
      );

      await this.userRepository.update(
        {
          user_name: body.user_name,
          password: body.password,
          email: body.email,
          phone_number: body.phone_number,
        },
        { where: { id: req.user.id }, transaction, individualHooks: true },
      );
    });

    sendHttpResponse(res, HttpStatus.OK);
  }
  // _________________________________________________________________
  /**
   *
   * @param req
   * @param res
   */
  async getInfo(req: Request, res: Response) {
    let companyData: Company = await this.companyRepository.findOne({
      raw: true,
      nest: true,
      attributes: { exclude: ['updatedAt'] },
      where: { id: 1 },
      include: [
        {
          model: this.userRepository,
          required: true,
          attributes: {
            exclude: [
              'id',
              'password',
              'role_id',
              'lang_id',
              'company_id',
              'updatedAt',
            ],
          },
          include: [
            {
              model: this.languageRepository,
              required: true,
              attributes: ['name', 'lang_code', 'id'],
            },
          ],
        },
      ],
    });
    if (companyData.logo != 'no logo found') {
      companyData.logo =
        process.env.LINK + '/uploads/company/' + companyData.logo;
    }
    sendHttpResponse(res, HttpStatus.OK, {
      companyData,
    });
  }
  // _________________________________________________________________
  /**
   *
   * @param file
   * @param req
   * @param res
   */
  async uploadLogo(file: any, req: Request, res: Response) {
    const company: Company = await this.companyRepository.findOne({
      raw: true,
      attributes: ['id'],
      where: { id: 1 },
    });
    if (!company) throw new CustomException('Company Not Found !');

    await this.companyRepository.update(
      { logo: file.filename },
      { where: { id: company.id } },
    );

    sendHttpResponse(res, HttpStatus.OK, {
      message: 'operation accomplished successfully',
      base_name: file.base_name,
      logo: process.env.LINK + '/uploads/company/' + file.filename,
    });
  }
  // _________________________________________________________________
  /**
   *
   * @param req
   * @param res
   */
  async removeLogo(req: Request, res: Response): Promise<any> {
    const company: Company = await this.companyRepository.findOne({
      raw: true,
      attributes: ['id'],
      where: { id: 1 },
    });
    if (!company) throw new CustomException('Company Not Found !');

    await this.companyRepository.update(
      { logo: 'no logo found' },
      { where: { id: company.id } },
    );

    sendHttpResponse(res, HttpStatus.OK);
  }
}
