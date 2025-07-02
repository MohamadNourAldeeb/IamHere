import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request, Response } from 'express';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { Role } from '../role/entities/role.entity';
import { CustomException } from 'src/common/constant/custum-error';
import { EmailService } from 'src/common/services/sendEmail';
import { Op } from 'sequelize';
import { ActivityLogs } from './entities/activity_log.entity';
import { ValidationDtoService } from 'src/common/services/validationService';
import { FindAllActivityLogsDto } from './dto/find-all-articles.dto';
import { Language } from 'src/languages/entities/language.entity';
import { sendHttpResponse } from 'src/common/services/request.service';
import { PaginationWithSearchQueries } from 'src/common/global/dto/global.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userRepository: typeof User,
    @InjectModel(ActivityLogs)
    private activityLogRepository: typeof ActivityLogs,
    @InjectModel(Role)
    private roleRepository: typeof Role,
    @InjectModel(Language)
    private languageRepository: typeof Language,
    private readonly ValidationService: ValidationDtoService,
    private readonly emailService: EmailService,
  ) {}
  // _________________________________________________________________
  /**
   *
   * @param req
   * @param res
   * @param body
   */
  async create(req: Request, res: Response, body: CreateUserDto) {
    if (body.role_id == 1)
      throw new CustomException(
        "You can't create account with super admin role",
      );
    if (
      await this.userRepository.findOne({
        raw: true,
        attributes: ['id'],
        where: { email: body.email.trim() },
      })
    )
      throw new CustomException('this email already exist🤨');
    if (
      await this.userRepository.findOne({
        raw: true,
        attributes: ['id'],
        where: { user_name: body.user_name.trim() },
      })
    )
      throw new CustomException('this user_name already exist🤨');
    if (
      await this.userRepository.findOne({
        raw: true,
        attributes: ['id'],
        where: { phone_number: body.phone_number.trim() },
      })
    )
      throw new CustomException('this phone_number already exist🤨');

    const role: any = await this.roleRepository.findOne({
      raw: true,
      attributes: ['id', 'name'],
      where: { id: body.role_id },
    });
    if (!role) throw new CustomException('this role ID is incorrect😒');

    const language: any = await this.languageRepository.findOne({
      raw: true,
      attributes: ['id', 'name'],
      where: { id: body.lang_id },
    });
    if (!language) throw new CustomException('this language ID is incorrect😒');

    await this.userRepository.create({
      user_name: body.user_name,
      email: body.email,
      phone_number: body.phone_number,
      password: body.password,
      address: body.address,
      lang_id: body.lang_id,
      role_id: body.role_id,
      company_id: 1,
    });

    // this.emailService.sendMail(body.user_name, body.password, body.email);
    sendHttpResponse(res, HttpStatus.OK);
  }
  // _________________________________________________________________
  /**
   *
   * @param req
   * @param res
   * @param query
   */
  async findAll(
    req: Request,
    res: Response,
    query: PaginationWithSearchQueries,
  ) {
    let { size, page, q } = query;
    let whereConditions = {};
    if (q)
      whereConditions = {
        [Op.or]: [
          {
            user_name: { [Op.like]: `%${q}%` },
          },
          {
            email: { [Op.like]: `%${q}%` },
          },
          {
            phone_number: { [Op.like]: `%${q}%` },
          },
          {
            id: { [Op.eq]: `${q}` },
          },
        ],
      };
    let { rows: users, count: total } = await User.findAndCountAll({
      raw: true,
      nest: true,
      limit: +size,
      offset: (+page - 1) * +size,
      attributes: {
        exclude: ['password'],
      },
      include: [
        {
          model: Role,
          as: 'role_info',
          required: true,
        },
      ],
      where: {
        ...whereConditions,
      },
    });

    sendHttpResponse(res, HttpStatus.OK, {
      users,
      total,
      page,
      perPage: +size,
      totalPages: Math.ceil(total / +size),
    });
  }
  // _________________________________________________________________
  /**
   *
   * @param req
   * @param res
   * @returns
   */
  async findAllActivityLog(req: Request, res: Response) {
    let query = {
      page: +req.query.page,
      size: +req.query.size,
    };

    try {
      // ! Validation section
      await this.ValidationService.validationDto(FindAllActivityLogsDto, query);
    } catch (error) {
      let errorMessage = '';
      if (error && error[0].constraints) {
        let errors = error[0].constraints;

        if (errors) errorMessage = Object.values(errors).join(', ');
        throw new CustomException(errorMessage);
      } else if (error) {
        throw new CustomException(
          'some fields is not correct validation error',
        );
      }
    }

    let { count, rows } = await this.activityLogRepository.findAndCountAll({
      raw: true,
      nest: true,
      offset: (+query.page - 1) * +query.size,
      order: [['id', 'DESC']],
      limit: +query.size,
      attributes: { exclude: ['created_by'] },
      include: [
        {
          model: User,
          required: true,
          attributes: ['id', 'user_name', 'email'],
          where: {},
        },
      ],
    });

    const total: any = count;
    const perPage: any = query.size;
    const lastPage: any = Math.ceil(total / perPage);
    return res.status(HttpStatus.OK).send({
      success: true,
      data: {
        records: rows,
        total: total,
        per_page: perPage,
        last_page: lastPage,
      },
    });
  }
  /**
   *
   * @param id
   * @param body
   * @param req
   * @param res
   */
  async update(id: number, body: UpdateUserDto, req: Request, res: Response) {
    if (id == 1)
      throw new CustomException("You can't update on the admin account ");

    let user: any = await this.userRepository.findOne({
      raw: true,
      where: { id },
    });
    if (!user) {
      throw new CustomException('there are not user with this id😒');
    }

    if (
      await this.userRepository.findOne({
        raw: true,
        attributes: ['id'],
        where: { id: { [Op.not]: id }, email: body.email.trim() },
      })
    )
      throw new CustomException('this email already exist🤨');

    if (
      await this.userRepository.findOne({
        raw: true,
        attributes: ['id'],
        where: {
          id: { [Op.not]: id },
          user_name: body.user_name.trim(),
        },
      })
    )
      throw new CustomException('this user_name already exist🤨');

    if (
      await this.userRepository.findOne({
        raw: true,
        attributes: ['id'],
        where: {
          id: { [Op.not]: id },
          phone_number: body.phone_number.trim(),
        },
      })
    )
      throw new CustomException('this phone number already exist🤨');

    await User.update({ ...body }, { where: { id }, individualHooks: true });

    sendHttpResponse(res, HttpStatus.OK);
  }
  // _________________________________________________________________
  /**
   *
   * @param id
   * @param req
   * @param res
   */
  async remove(id: number, req: Request, res: Response) {
    if (id == 1) throw new CustomException("You can't delete default user");
    let user = await this.userRepository.findOne({
      raw: true,
      where: { id },
    });
    if (!user) throw new CustomException('there are no user with this id😒');

    await User.destroy({ where: { id } });
    sendHttpResponse(res, HttpStatus.OK);
  }
}
