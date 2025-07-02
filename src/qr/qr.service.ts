import { HttpStatus, Injectable } from '@nestjs/common';
import { EncryptionService } from 'src/common/services/encrypt.service';
import * as crypto from 'crypto';
import * as moment from 'moment';
import { RedisService } from 'src/common/services/redis.service';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { EmployeeRecord } from 'src/employee_record/entities/employee_record.entity';
import { Sequelize } from 'sequelize-typescript';
import { Request, Response } from 'express';
import { CustomException } from 'src/common/constant/custum-error';
import { sendHttpResponse } from 'src/common/services/request.service';
import { IpService } from 'src/common/services/ip.service';
import { Op } from 'sequelize';

@Injectable()
export class QrService {
  constructor(
    private readonly encryptingServices: EncryptionService,
    private readonly redisService: RedisService,
    private readonly ipServices: IpService,
    @InjectModel(EmployeeRecord)
    private EmployeeRecordRepository: typeof EmployeeRecord,
    @InjectConnection() private sequelizeConnection: Sequelize,
  ) {}
  // _________________________________________________________________
  /**
   *
   * @param req
   * @param res
   */
  async generateQR(req: Request, res: Response) {
    let otp: string = crypto.randomInt(1000, 99999).toString();
    let date = moment().format('YYYY-MM-DD').toString();
    let ip: any = await this.ipServices.getServerIp();
    let dateOfCache: any = await this.redisService.getFromRedisCache(
      moment().format('YYYY-MM-DD').toString(),
    );
    const fromLastMonth = moment().subtract(1, 'month').format('YYYY-MM-DD');

    // ! Add to cache
    this.redisService.addToRedisCache(
      `${date}`,
      JSON.stringify({ otp, date }),
      60 * 60 * 24,
    );

    if (!dateOfCache) {
      let usersWithoutLogout = await this.EmployeeRecordRepository.findAll({
        raw: true,
        attributes: [
          'id',
          'user_id',
          [Sequelize.fn('count', Sequelize.col('user_id')), 'count'],
          [Sequelize.fn('DATE', Sequelize.col('createdAt')), 'date'],
          [Sequelize.fn('max', Sequelize.col('id')), 'last_id'],
        ],
        where: {
          [Op.and]: [
            Sequelize.where(Sequelize.fn('DATE', Sequelize.col('createdAt')), {
              [Op.gt]: fromLastMonth,
            }),
            Sequelize.where(Sequelize.fn('DATE', Sequelize.col('createdAt')), {
              [Op.ne]: date,
            }),
            { state: { [Op.not]: 'timeout' } },
          ],
        },
        group: ['user_id', Sequelize.fn('DATE', Sequelize.col('createdAt'))],
      });

      usersWithoutLogout = usersWithoutLogout
        .filter((user: any) => user.count % 2 != 0)
        .map((user: any) => user.last_id);

      if (usersWithoutLogout.length > 0) {
        await EmployeeRecord.update(
          { state: 'timeout' },
          { where: { id: usersWithoutLogout } },
        );
      }
    }

    let encrypted: any = await this.encryptingServices.encrypt(
      JSON.stringify({ otp, date }),
    );

    sendHttpResponse(res, HttpStatus.OK, {
      information: encrypted.encrypted + '-' + encrypted.hashedData,
      ip,
    });
  }
  // _________________________________________________________________
  /**
   *
   * @param req
   * @param res
   * @param body
   */
  async scan(req: Request, res: Response, body: any) {
    if (req.user.id == 1)
      throw new CustomException('you cant scan with admin ?!!');
    let qr: string = body.qr;
    let encryptedQr: string[] = qr.split('-');
    let encrypt: string = encryptedQr[0];
    let hash: string = encryptedQr[1];
    let decrypted: any = await this.encryptingServices.decrypt(encrypt, hash);
    if (decrypted == false) throw new CustomException('qr code is incorrect');
    decrypted = JSON.parse(decrypted);

    let dateFromCache: any = await this.redisService.getFromRedisCache(
      moment().format('YYYY-MM-DD'),
    );
    if (dateFromCache == null) throw new CustomException('somethings be wrong');

    dateFromCache = JSON.parse(dateFromCache);
    if (
      decrypted.otp != dateFromCache.otp ||
      decrypted.date != dateFromCache.date
    )
      throw new CustomException('qr is wrong');

    let state = 'login';

    await this.sequelizeConnection.transaction(async (transaction: any) => {
      let last_state = await this.EmployeeRecordRepository.findOne({
        where: {
          [Op.and]: [
            this.sequelizeConnection.literal(
              `DATE_FORMAT(createdAt, '%Y-%m-%d') = '${moment().format('YYYY-MM-DD')}'`,
            ),
            { user_id: req.user.id },
          ],
        },
        order: [['createdAt', 'DESC']],
        lock: transaction.LOCK.UPDATE,
        transaction,
      });

      if (last_state) {
        state = last_state.state === 'logout' ? 'login' : 'logout';
      }
      try {
        await this.EmployeeRecordRepository.create(
          {
            state,
            user_id: req.user.id,
            created_by: req.user.id,
          },
          { transaction },
        );
      } catch (error) {
        throw new CustomException('There is another process to implement');
      }
    });

    sendHttpResponse(res, HttpStatus.OK);
  }
}
