import { HttpStatus, Injectable } from '@nestjs/common';
import { getAllRecordsDto } from './dto/create-employee_record.dto';
import { Request, Response } from 'express';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { EmployeeRecord } from './entities/employee_record.entity';
import { sendHttpResponse } from 'src/common/services/request.service';
import { User } from 'src/user/entities/user.entity';
import { Role } from 'src/role/entities/role.entity';
import { Language } from 'src/languages/entities/language.entity';
import * as moment from 'moment';
import { Op } from 'sequelize';
import { Company } from 'src/company/entities/company.entity';
import { PaginationQueries } from 'src/common/global/dto/global.dto';

@Injectable()
export class EmployeeRecordService {
  constructor(
    @InjectModel(EmployeeRecord)
    private EmployeeRecordRepository: typeof EmployeeRecord,
    @InjectModel(User)
    private userRepository: typeof User,
    @InjectModel(Company)
    private companyRepository: typeof Company,
  ) {}
  // _________________________________________________________________
  /**
   *
   * @param req
   * @param res
   * @param query
   */
  async getRecords(req: Request, res: Response, query: any) {
    let userData: any = await this.userRepository.findOne({
      raw: true,
      nest: true,
      attributes: [
        'id',
        'user_name',
        'email',
        'phone_number',
        'address',
        'createdAt',
      ],
      include: [
        {
          model: Role,
          required: true,
        },
        {
          model: Language,
          required: true,
        },
      ],

      where: { id: req.user.id },
    });

    userData = {
      user_id: userData.id,
      user_name: userData.user_name,
      email: userData.email,
      phone_number: userData.phone_number,
      address: userData.address,
      createdAt: userData.createdAt,
      role_name: userData.role_info.name,
      language_name: userData.lang_id_info.name,
      lang_code: userData.lang_id_info.lang_code,
    };
    let dateFilter = null;
    if (req.query.date) dateFilter = req.query.date;
    else dateFilter = moment().format('YYYY-MM');

    let conditionsCheck: any = {
      [Op.and]: [
        { user_id: req.user.id },
        Sequelize.where(
          Sequelize.fn(
            'DATE_FORMAT',
            Sequelize.col('EmployeeRecord.createdAt'),
            '%Y-%m',
          ),
          moment(dateFilter).format('YYYY-MM').toString(),
        ),
      ],
    };

    const records = await this.EmployeeRecordRepository.findAll({
      nest: true,
      raw: true,
      where: conditionsCheck,
      order: [['createdAt', 'ASC']],
    });

    const groupedRecords = records.reduce((acc, record) => {
      record.createdAt = new Date(record.createdAt);
      const date = record.createdAt.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(record);
      return acc;
    }, {});

    const results = [];

    for (const date in groupedRecords) {
      const dailyRecords = groupedRecords[date];
      let workTime = 0;
      let loginTime = null;

      for (const record of dailyRecords) {
        if (record.state === 'login') {
          loginTime = record.createdAt;
        } else if (record.state === 'logout' && loginTime) {
          const logoutTime = record.createdAt;
          const timeDiff = logoutTime - loginTime;
          workTime += timeDiff;
          loginTime = null;
        }
      }
      const workHours = Math.floor(workTime / (1000 * 60 * 60));
      const workMinutes = Math.floor(
        (workTime % (1000 * 60 * 60)) / (1000 * 60),
      );
      const workSeconds = Math.floor((workTime % (1000 * 60)) / 1000);

      results.push({
        date,
        work_time: { workHours, workMinutes, workSeconds },
      });
    }
    const expectedWorkHours = 8;
    const expectedWorkTime = expectedWorkHours * 60 * 60 * 1000;

    for (const result of results) {
      const workTime =
        result.work_time.workHours * 60 * 60 * 1000 +
        result.work_time.workMinutes * 60 * 1000 +
        result.work_time.workSeconds * 1000;

      if (workTime > expectedWorkTime) {
        const overTime = workTime - expectedWorkTime;
        result.over_time = {
          overTimeHours: Math.floor(overTime / (1000 * 60 * 60)),
          overTimeMinutes: Math.floor(
            (overTime % (1000 * 60 * 60)) / (1000 * 60),
          ),
          overTimeSeconds: Math.floor((overTime % (1000 * 60)) / 1000),
        };
        result.under_time = {
          underTimeHours: 0,
          underTimeMinutes: 0,
          underTimeSeconds: 0,
        };
      } else {
        const underTime = expectedWorkTime - workTime;
        result.under_time = {
          underTimeHours: Math.floor(underTime / (1000 * 60 * 60)),
          underTimeMinutes: Math.floor(
            (underTime % (1000 * 60 * 60)) / (1000 * 60),
          ),
          underTimeSeconds: Math.floor((underTime % (1000 * 60)) / 1000),
        };
        result.over_time = {
          overTimeHours: 0,
          overTimeMinutes: 0,
          overTimeSeconds: 0,
        };
      }
    }
    sendHttpResponse(res, HttpStatus.OK, {
      employee_info: userData,
      results,
    });
  }
  // _________________________________________________________________
  /**
   *
   * @param req
   * @param res
   * @param query
   */
  async getAllRecords(req: Request, res: Response, query: getAllRecordsDto) {
    const { page, size, date, user_id }: any = req.query;
    const dateFilter: any =
      moment(date).format('YYYY-MM') || moment().format('YYYY-MM');

    const year = dateFilter.split('-')[0];
    const month = dateFilter.split('-')[1];

    let userCondition: any = { role_id: { [Op.not]: [1, 2] } };

    if (user_id) {
      userCondition = { id: user_id, role_id: { [Op.not]: [1, 2] } };
    }
    const company = await this.companyRepository.findOne({
      raw: true,
      where: { id: 1 },
    });
    const { count, rows: users }: any =
      await this.userRepository.findAndCountAll({
        raw: true,
        nest: true,
        attributes: [
          'id',
          'user_name',
          'email',
          'phone_number',
          'address',
          'createdAt',
        ],
        include: [
          {
            model: Role,
            required: true,
            attributes: ['name'],
          },
          {
            model: Language,
            required: true,
            attributes: ['name', 'lang_code'],
          },
        ],
        limit: +size,
        offset: (+page - 1) * +size,
        where: userCondition,
      });
    const results = [];

    for (const user of users) {
      const userRecords: any = await this.EmployeeRecordRepository.findAll({
        where: {
          [Op.and]: [
            { user_id: user.id },
            Sequelize.where(
              Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), '%Y-%m'),
              moment(dateFilter).format('YYYY-MM'),
            ),
          ],
        },
        order: [['createdAt', 'ASC']],
        raw: true,
      });

      const groupedRecords = userRecords.reduce((acc: any, record: any) => {
        record.createdAt = new Date(record.createdAt);
        const date = record.createdAt.toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(record);
        return acc;
      }, {});

      let totalMonthWork = 0;
      const userResults = [];
      for (const date in groupedRecords) {
        const dailyRecords = groupedRecords[date];
        let workTime: any = 0;
        let loginTime: any = null;

        for (const record of dailyRecords) {
          if (record.state === 'login') {
            loginTime = record.createdAt;
          } else if (record.state === 'logout' && loginTime) {
            const logoutTime: any = record.createdAt;
            const timeDiff: any = logoutTime - loginTime;
            workTime += timeDiff;
            totalMonthWork += timeDiff;
            loginTime = null;
          }
        }

        const workHours = Math.floor(workTime / (1000 * 60 * 60));
        const workMinutes = Math.floor(
          (workTime % (1000 * 60 * 60)) / (1000 * 60),
        );
        const workSeconds = Math.floor((workTime % (1000 * 60)) / 1000);

        const result = {
          date,
          work_time: { workHours, workMinutes, workSeconds },
          over_time: {
            overTimeHours: 0,
            overTimeMinutes: 0,
            overTimeSeconds: 0,
          },
          under_time: {
            underTimeHours: 0,
            underTimeMinutes: 0,
            underTimeSeconds: 0,
          },
        };

        const expectedWorkHours = company.work_hours;
        const expectedWorkTime = expectedWorkHours * 60 * 60 * 1000;

        if (workTime > expectedWorkTime) {
          const overTime = workTime - expectedWorkTime;
          result.over_time = {
            overTimeHours: Math.floor(overTime / (1000 * 60 * 60)),
            overTimeMinutes: Math.floor(
              (overTime % (1000 * 60 * 60)) / (1000 * 60),
            ),
            overTimeSeconds: Math.floor((overTime % (1000 * 60)) / 1000),
          };
        } else {
          const underTime = expectedWorkTime - workTime;
          result.under_time = {
            underTimeHours: Math.floor(underTime / (1000 * 60 * 60)),
            underTimeMinutes: Math.floor(
              (underTime % (1000 * 60 * 60)) / (1000 * 60),
            ),
            underTimeSeconds: Math.floor((underTime % (1000 * 60)) / 1000),
          };
        }

        userResults.push(result);
      }

      let total_month_work = {
        Hours: Math.floor(totalMonthWork / (1000 * 60 * 60)),
        Minutes: Math.floor((totalMonthWork % (1000 * 60 * 60)) / (1000 * 60)),
        Seconds: Math.floor((totalMonthWork % (1000 * 60)) / 1000),
      };

      let should_work_this_month =
        new Date(year, month, 0).getDate() * company.work_hours;

      const expectedWorkTime = should_work_this_month * 60 * 60 * 1000;

      let month_works: any = {
        work_time: total_month_work,
        over_time: {
          overTimeHours: 0,
          overTimeMinutes: 0,
          overTimeSeconds: 0,
        },
        under_time: {
          underTimeHours: 0,
          underTimeMinutes: 0,
          underTimeSeconds: 0,
        },
      };
      if (totalMonthWork > expectedWorkTime) {
        const overTime = totalMonthWork - expectedWorkTime;
        month_works.over_time = {
          overTimeHours: Math.floor(overTime / (1000 * 60 * 60)),
          overTimeMinutes: Math.floor(
            (overTime % (1000 * 60 * 60)) / (1000 * 60),
          ),
          overTimeSeconds: Math.floor((overTime % (1000 * 60)) / 1000),
        };
      } else {
        const underTime = expectedWorkTime - totalMonthWork;

        month_works.under_time = {
          underTimeHours: Math.floor(underTime / (1000 * 60 * 60)),
          underTimeMinutes: Math.floor(
            (underTime % (1000 * 60 * 60)) / (1000 * 60),
          ),
          underTimeSeconds: Math.floor((underTime % (1000 * 60)) / 1000),
        };
      }

      results.push({
        user_id: user.id,
        user_name: user.user_name,
        email: user.email,
        phone_number: user.phone_number,
        address: user.address,
        role_name: user.role_info.name,
        language_name: user.lang_id_info.name,
        lang_code: user.lang_id_info.lang_code,
        work_records: userResults,
        should_work_this_month:
          new Date(year, month, 0).getDate() * company.work_hours,
        month_works,
      });
    }

    sendHttpResponse(res, HttpStatus.OK, {
      success: true,
      data: results,
      pagination: {
        total: count,
        page: +page,
        perPage: +size,
        totalPages: Math.ceil(count / size),
      },
    });
  }
  // _________________________________________________________________
  /**
   *
   * @param req
   * @param res
   * @param query
   */
  async geMytLogs(req: Request, res: Response, query: PaginationQueries) {
    const { page, size }: any = req.query;
    let userData: any = await this.userRepository.findOne({
      raw: true,
      nest: true,
      attributes: [
        'id',
        'user_name',
        'email',
        'phone_number',
        'address',
        'createdAt',
      ],
      include: [
        {
          model: Role,
          required: true,
        },
        {
          model: Language,
          required: true,
        },
      ],
      where: { id: req.user.id },
    });

    userData = {
      user_id: userData.id,
      user_name: userData.user_name,
      email: userData.email,
      phone_number: userData.phone_number,
      address: userData.address,
      createdAt: userData.createdAt,
      role_name: userData.role_info.name,
      language_name: userData.lang_id_info.name,
      lang_code: userData.lang_id_info.lang_code,
    };
    let dateFilter = null;
    if (req.query.date) dateFilter = req.query.date;
    else dateFilter = moment().format('YYYY-MM-DD');

    let conditionsCheck: any = {
      [Op.and]: [
        { user_id: req.user.id },
        Sequelize.where(
          Sequelize.fn(
            'DATE_FORMAT',
            Sequelize.col('EmployeeRecord.createdAt'),
            '%Y-%m-%d',
          ),
          moment(dateFilter).format('YYYY-MM-DD').toString(),
        ),
      ],
    };

    const { rows: records, count: total } =
      await this.EmployeeRecordRepository.findAndCountAll({
        raw: true,
        attributes: { exclude: ['created_by', 'user_id', 'updatedAt'] },
        where: conditionsCheck,
        limit: +size,
        offset: (+page - 1) * +size,
        order: [['createdAt', 'ASC']],
      });

    sendHttpResponse(res, HttpStatus.OK, {
      employee_info: userData,
      records,
      pagination: {
        total,
        page: +page,
        perPage: +size,
        totalPages: Math.ceil(total / size),
      },
    });
  }
}
