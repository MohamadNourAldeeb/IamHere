import { HttpStatus, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { signInDto } from './dto/signInDto';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { User } from 'src/user/entities/user.entity';
import { RefreshToken } from 'src/user/entities/refresh_token.entity';
import * as bcrypt from 'bcrypt';
import { Sequelize } from 'sequelize-typescript';
import { RefreshTokenDto } from './dto/RefreshTokenDto';
import { v4 as _idv4 } from 'uuid';
import { UserPermission } from 'src/user/entities/user_permission.entity';
import * as crypto from 'crypto';
import { MailerService } from '@nestjs-modules/mailer';
import { changePassDto } from './dto/changePassDto';
import { JWTService } from 'src/common/services/jwt.services';
import { RedisService } from 'src/common/services/redis.service';
import { registerDto } from './dto/registerDto';
import { Language } from 'src/languages/entities/language.entity';
import { CustomException } from 'src/common/constant/custum-error';
import { Role } from 'src/role/entities/role.entity';
import { Permission } from 'src/permission/entities/permission.entity';
import { RolePermission } from 'src/role/entities/roles_permissions.entity';
import { sendHttpResponse } from 'src/common/services/request.service';
import { deviceType } from 'src/common/enums/enums';
import { EncryptionService } from 'src/common/services/encrypt.service';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private userRepository: typeof User,
    @InjectModel(UserPermission)
    private userPermissionRepository: typeof UserPermission,
    @InjectModel(RolePermission)
    private RolePermissionRepository: typeof RolePermission,
    @InjectModel(Permission)
    private PermissionRepository: typeof Permission,
    @InjectModel(Role)
    private RoleRepository: typeof Role,
    @InjectModel(Language)
    private LanguageRepository: typeof Language,
    @InjectModel(RefreshToken)
    private RefreshTokenRepository: typeof RefreshToken,
    private readonly jwtServices: JWTService,
    private readonly mailerService: MailerService,
    @InjectConnection() private sequelizeConnection: Sequelize,
    private readonly redisService: RedisService,
    private readonly encryptionService: EncryptionService,
  ) {}

  timeToMilliseconds(timeString: string) {
    const parts = timeString.split(' ');
    let totalMilliseconds = 0;

    for (const part of parts) {
      const [value, unit] = part.match(/(\d+)([dhm])/).slice(1);

      switch (unit.toLowerCase()) {
        case 'h':
          totalMilliseconds += parseInt(value) * 3600000; // Convert hours to milliseconds
          break;
        case 'd':
          totalMilliseconds += parseInt(value) * 86400000; // Convert days to milliseconds
          break;
        case 'm':
          totalMilliseconds += parseInt(value) * 60000; // Convert minutes to milliseconds
          break;
        default:
          console.error(`Unknown unit: ${unit}`);
      }
    }

    return totalMilliseconds;
  }

  async sendMail(user_name: string, verifiedCode: string, email: string) {
    const html = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <title>Static Template</title>
    
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        style="
          margin: 0;
          font-family: 'Poppins', sans-serif;
          background: #ffffff;
          font-size: 14px;
        "
      >
        <div
          style="
            max-width: 680px;
            margin: 0 auto;
            padding: 45px 30px 60px;
            background: #f4f7ff;
            background-image: url(https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661497957196_595865/email-template-background-banner);
            background-repeat: no-repeat;
            background-size: 800px 452px;
            background-position: top center;
            font-size: 14px;
            color: #434343;
          "
        >
          <header>
            <table style="width: 100%;">
              <tbody>
                <tr style="height: 0;">
                  <td >
                  <span
                      style="font-size: 16px; line-height: 30px; color: #ffffff;"
                      > Yes Company
                      </span
                    >
                  </td>
                  <td style="text-align: right;">
                    <span
                      style="font-size: 16px; line-height: 30px; color: #ffffff;"
                      >${new Date().getDate()}/${
                        new Date().getMonth() + 1
                      }/${new Date().getFullYear()}</span
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </header>
    
          <main>
            <div
              style="
                margin: 0;
                margin-top: 70px;
                padding: 92px 30px 115px;
                background: #ffffff;
                border-radius: 30px;
                text-align: center;
              "
            >
              <div style="width: 100%; max-width: 489px; margin: 0 auto;">
              <h1
              style="
                margin: 0;
                font-size: 24px;
                font-weight: 500;
                color: #1f1f1f;
              "
            >
             Yes For Supporting
            </h1>
            <br>
                <h5
                  style="
                    margin: 0;
                    font-size: 24px;
                    font-weight: 500;
                    color: #1f1f1f;
                  "
                >
                  Your OTP
                </h5>
                <p
                  style="
                    margin: 0;
                    margin-top: 17px;
                    font-size: 16px;
                    font-weight: 500;
                  "
                >
                  Hey ${user_name} ,
                </p>
                <p
                  style="
                    margin: 0;
                    margin-top: 17px;
                    font-weight: 500;
                    letter-spacing: 0.56px;
                  "
                >
                  Thank you for choosing our Supporting App. Use the following OTP
                  to complete the procedure for authentication. OTP is
                  valid for
                  <span style="font-weight: 600; color: #1f1f1f;">3 minutes</span>.
                  Do not share this code with others
                </p>
                <p
                  style="
                    margin: 0;
                    margin-top: 60px;
                    font-size: 40px;
                    font-weight: 600;
                    letter-spacing: 25px;
                    color: #ba3d4f;
                  "
                >
                ${verifiedCode}
                </p>
              </div>
            </div>
    
            <p
              style="
                max-width: 400px;
                margin: 0 auto;
                margin-top: 90px;
                text-align: center;
                font-weight: 500;
                color: #8c8c8c;
              "
            >
              Need help? Ask at
              <a
                href="mohamad2129880@gmail.com"
                style="color: #499fb6; text-decoration: none;"
                >mohamad2129880@gmail.com</a
              >
              or visit our
              <a
                href=""
                target="_blank"
                style="color: #499fb6; text-decoration: none;"
                >Help Center</a
              >
            </p>
          </main>
    
          <footer
            style="
              width: 100%;
              max-width: 490px;
              margin: 20px auto 0;
              text-align: center;
              border-top: 1px solid #e6ebf1;
            "
          >
            <p
              style="
                margin: 0;
                margin-top: 40px;
                font-size: 16px;
                font-weight: 600;
                color: #434343;
              "
            >
              Yes For HC APP
            </p>
            <p style="margin: 0; margin-top: 8px; color: #434343;">
              Address homs syria 
            </p>
            <p style="margin: 0; margin-top: 8px; color: #434343;">
           Eng:mohamad noor aldeeb
          </p>
        
         
            <div style="margin: 0; margin-top: 16px;">
              <a href="" target="_blank" style="display: inline-block;">
                <img
                  width="36px"
                  alt="Facebook"
                  src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661502815169_682499/email-template-icon-facebook"
                />
              </a>
              <a
                href=""
                target="_blank"
                style="display: inline-block; margin-left: 8px;"
              >
                <img
                  width="36px"
                  alt="Instagram"
                  src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661504218208_684135/email-template-icon-instagram"
              /></a>
              <a
                href=""
                target="_blank"
                style="display: inline-block; margin-left: 8px;"
              >
                <img
                  width="36px"
                  alt="Twitter"
                  src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661503043040_372004/email-template-icon-twitter"
                />
              </a>

            </div>
            <p style="margin: 0; margin-top: 16px; color: #434343;">
              Copyright © 2022 Company. All rights reserved.
            </p>
          </footer>
        </div>
      </body>
    </html>
    `;
    const message = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: 'Hello ✔',
      html,
    };
    await this.mailerService.sendMail(message);
  }
  async signIn(
    req: Request,
    res: Response,
    signInDto: signInDto,
  ): Promise<any> {
    // check if user found
    const user = await this.userRepository.findOne({
      raw: true,
      where: { user_name: signInDto.user_name },
    });
    if (!user) throw new CustomException('The entered user_name is incorrect');

    //  if error password increment the counter
    if (!(await bcrypt.compare(signInDto.password, user.password)))
      throw new CustomException('The password is incorrect');

    const token = this.jwtServices.generateToken(
      {
        id: user.id,
        lang_id: user.lang_id,
        user_name: user.user_name,
        email: user.email,
        device_serial: signInDto.device_serial,
        device_type: signInDto.device_type,
        role_id: user.role_id,
      },
      process.env.TOKEN_SECRET_KEY,
      process.env.TOKEN_EXPIRES_IN,
    );

    const refresh_token = this.jwtServices.generateToken(
      {
        id: user.id,
        user_name: user.user_name,
        email: user.email,
        device_serial: signInDto.device_serial,
        role_id: user.role_id,
        device_type: signInDto.device_type,
      },
      process.env.REFRESH_TOKEN_SECRET_KEY,
      process.env.REFRESH_TOKEN_EXPIRES_IN,
    );

    await this.sequelizeConnection.transaction(async (transaction: any) => {
      let refreshCheck: any = await this.RefreshTokenRepository.findOne({
        raw: true,
        where: {
          user_id: user.id,
          device_serial: signInDto.device_serial,
        },
      });
      if (refreshCheck) {
        await this.RefreshTokenRepository.destroy({
          where: {
            user_id: user.id,
            device_serial: signInDto.device_serial,
          },
          transaction,
        });
        await this.redisService.deleteFromRedis(`${refreshCheck.id}`);
      }
      let createdRefreshToken: any = await this.RefreshTokenRepository.create(
        {
          device_serial: signInDto.device_serial,
          device_type: signInDto.device_type,
          token: refresh_token.token,
          user_id: user.id,
          expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
        { transaction },
      );

      await this.redisService.addToRedisCache(
        `${createdRefreshToken.id}`,
        `${token.jti}`,
        this.timeToMilliseconds(process.env.TOKEN_EXPIRES_IN as string),
      );
    });

    let role_permissions: any = await this.RolePermissionRepository.findAll({
      raw: true,
      nest: true,
      include: [
        {
          model: Permission,
          required: true,
        },
      ],
      where: { role_id: user.role_id },
    });
    role_permissions = role_permissions.map((item: any) => {
      return item.Permission;
    });

    sendHttpResponse(res, HttpStatus.OK, {
      message: `Hello `,
      token: token.token,
      refresh_token: refresh_token.token,
      user_permissions: role_permissions,
      role_id: user.role_id,
    });
  }
  async refreshToken(
    req: Request,
    res: Response,
    body: RefreshTokenDto,
  ): Promise<any> {
    let refreshToken = body.refresh_token;
    let decoded: any = null;
    try {
      decoded = await this.jwtServices.verifyToken(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET_KEY,
      );
    } catch (error) {
      throw new CustomException('Invalid refresh token');
    }

    const user_id = decoded.id;

    let refreshTokenRaw: RefreshToken =
      await this.RefreshTokenRepository.findOne({
        raw: true,
        nest: true,
        include: [
          {
            model: User,
            required: true,
          },
        ],
        where: { user_id, device_serial: decoded.device_serial },
      });

    if (!refreshTokenRaw)
      throw new CustomException('You have logged out', HttpStatus.UNAUTHORIZED);

    let test = this.encryptionService.decryptToken(refreshTokenRaw.token);
    if (test !== refreshToken)
      throw new CustomException(
        'Invalid refresh token',
        HttpStatus.UNAUTHORIZED,
      );

    if (decoded.device_serial !== refreshTokenRaw.device_serial)
      throw new CustomException(
        'The serial dose not match the serial in token ',
      );
    let newRefreshToken: any = refreshToken;

    await this.sequelizeConnection.transaction(async (transaction: any) => {
      if (new Date(refreshTokenRaw.expiry).getTime() < new Date().getTime()) {
        await this.RefreshTokenRepository.destroy({
          where: { id: refreshTokenRaw.id },
          transaction,
        });
        await this.redisService.deleteFromRedis(`${refreshTokenRaw.id}`);

        newRefreshToken = this.jwtServices.generateToken(
          {
            id: refreshTokenRaw.user.id,
            user_name: refreshTokenRaw.user.user_name,
            email: refreshTokenRaw.user.email,
            device_serial: refreshTokenRaw.device_serial,
            role_id: refreshTokenRaw.user.role_id,
            device_type: refreshTokenRaw.device_type,
          },
          process.env.REFRESH_TOKEN_SECRET_KEY as string,
          process.env.REFRESH_TOKEN_EXPIRES_IN as string,
        );

        refreshTokenRaw = await this.RefreshTokenRepository.create(
          {
            device_serial: refreshTokenRaw.device_serial,
            token: refreshToken,
            user_id: refreshTokenRaw.user.id,
            ip: req.ip,
            expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            device_type: refreshTokenRaw.device_type,
          },
          { transaction },
        );
      }
    });

    const token = this.jwtServices.generateToken(
      {
        id: refreshTokenRaw.user.id,
        user_name: refreshTokenRaw.user.user_name,
        email: refreshTokenRaw.user.email,
        device_serial: refreshTokenRaw.device_serial,
        device_type: refreshTokenRaw.device_type,
        role_id: refreshTokenRaw.user.role_id,
      },
      process.env.TOKEN_SECRET_KEY,
      process.env.TOKEN_EXPIRES_IN,
    );
    return res.status(HttpStatus.OK).send({
      success: true,
      data: {
        message: `Hello ,this is new token 😊🙋‍♂️ `,
        token: token.token,
        refresh_token: newRefreshToken.token
          ? newRefreshToken.token
          : newRefreshToken,
      },
    });
  }
  async changePass(
    req: Request,
    res: Response,
    body: changePassDto,
  ): Promise<any> {
    const user: any = await this.userRepository.findOne({
      where: { id: req.user.id },
    });

    if (!(await bcrypt.compare(body.old_password, user.password)))
      throw new CustomException('The password is incorrect');

    await this.userRepository.update(
      { password: body.new_password },
      { where: { id: req.user.id }, individualHooks: true },
    );

    const refreshToken: RefreshToken =
      await this.RefreshTokenRepository.findOne({
        raw: true,
        attributes: ['id'],
        where: { user_id: req.user.id, device_serial: req.user.device_serial },
      });
    if (refreshToken) {
      await this.RefreshTokenRepository.destroy({
        where: {
          id: refreshToken.id,
        },
      });
      await this.redisService.deleteFromRedis(`${refreshToken.id}`);
    }
    sendHttpResponse(res, HttpStatus.OK, {
      message: ` login again my friend 😊🙋‍♂️ `,
    });
  }
  async logOut(req: Request, res: Response): Promise<any> {
    const refreshToken: RefreshToken =
      await this.RefreshTokenRepository.findOne({
        raw: true,
        attributes: ['id'],
        where: { user_id: req.user.id, device_serial: req.user.device_serial },
      });

    await this.RefreshTokenRepository.destroy({
      where: {
        id: refreshToken.id,
      },
    });

    await this.redisService.deleteFromRedis(`${refreshToken.id}`);
    sendHttpResponse(res, HttpStatus.OK, {
      message: `good bay my friend 😊🙋‍♂️ `,
    });
  }
  async register(req: Request, res: Response, body: registerDto): Promise<any> {
    if (
      await this.userRepository.findOne({
        attributes: ['id'],
        where: { user_name: body.user_name.trim() },
      })
    )
      throw new CustomException('user name already exist !!');

    if (
      await this.userRepository.findOne({
        attributes: ['id'],
        where: { email: body.email.trim() },
      })
    )
      throw new CustomException('email already exist !!');
    if (
      await this.userRepository.findOne({
        attributes: ['id'],
        where: { phone_number: body.phone_number.trim() },
      })
    )
      throw new CustomException('phone number already exist !!');
    let role = await this.RoleRepository.findOne({
      raw: true,
      attributes: ['id', 'name'],
      where: { id: body.role_id },
    });
    if (!role) throw new CustomException('Not found role with this Id');

    if (role.id == 1)
      throw new CustomException(
        "You can't create account with super admin role",
      );
    if (role.id != 2 && body.device_type == deviceType.android)
      throw new CustomException(
        "You can't create else user account with this device",
      );
    let language = await this.LanguageRepository.findOne({
      raw: true,
      attributes: ['id'],
      where: { id: body.lang_id },
    });
    if (!language) throw new CustomException('the lang id is incorrect');

    let user = await this.userRepository.create({
      user_name: body.user_name,
      email: body.email,
      phone_number: body.phone_number,
      password: body.password,
      address: body.address,
      lang_id: language.id,
      role_id: body.role_id,
      company_id: 1,
    });
    let role_permissions: any = await this.RolePermissionRepository.findAll({
      raw: true,
      nest: true,
      include: [
        {
          model: Permission,
          required: true,
        },
      ],
      where: { role_id: body.role_id },
    });

    role_permissions = role_permissions.map((item: any) => {
      return item.Permission;
    });

    const token = this.jwtServices.generateToken(
      {
        id: user.id,
        lang_id: user.lang_id,
        user_name: user.user_name,
        email: user.email,
        device_serial: body.device_serial,
        device_type: body.device_type,
        role_id: user.role_id,
      },
      process.env.TOKEN_SECRET_KEY,
      process.env.TOKEN_EXPIRES_IN,
    );

    const refresh_token = this.jwtServices.generateToken(
      {
        id: user.id,
        user_name: user.user_name,
        email: user.email,
        device_serial: body.device_serial,
        role_id: user.role_id,
        device_type: body.device_type,
      },
      process.env.REFRESH_TOKEN_SECRET_KEY,
      process.env.REFRESH_TOKEN_EXPIRES_IN,
    );
    this.RefreshTokenRepository.create({
      device_serial: body.device_serial,
      device_type: body.device_type,
      token: refresh_token,
      user_id: user.id,
      expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    await this.redisService.addToRedisCache(
      `${user.id}`,
      `${token}`,
      this.timeToMilliseconds(process.env.TOKEN_EXPIRES_IN),
    );
    sendHttpResponse(res, HttpStatus.OK, {
      message: `Hello `,
      token,
      refresh_token,
      role_id: body.role_id,
      role_permissions,
    });
  }
}
