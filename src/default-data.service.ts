import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Repository, Sequelize } from 'sequelize-typescript';
import { Role } from 'src/role/entities/role.entity';
import { User } from 'src/user/entities/user.entity';
import { Language } from './languages/entities/language.entity';
import { permissions_db } from './common/constant/permissions';
// import { PermissionTypes } from './permission/entities/permissionTypes.entity';
import { Permission } from './permission/entities/permission.entity';
import { Company } from './company/entities/company.entity';
@Injectable()
export class DefaultDataService {
  constructor(
    @InjectModel(User)
    private readonly UserRepository: Repository<User>,
    @InjectModel(Language)
    private readonly LanguageRepository: Repository<Language>,
    @InjectModel(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectModel(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectConnection() private sequelizeConnection: Sequelize,
  ) {}

  async insertDefaultData(): Promise<void> {
    if (!(await this.UserRepository.findOne({ where: { id: 1 } }))) {
      // let permissionTypes = [
      //   { name: 'supporters' },
      //   { name: 'service_types' },
      //   { name: 'role' },
      //   { name: 'company' },
      //   { name: 'users' },
      //   { name: 'faq' },
      //   { name: 'application' },
      //   { name: 'support_types' },
      // ];

      // allPermissions = permissions_db.map((item: any) => {
      //   return {
      //     mode: item.mode,
      //     description: item.description,
      //   };
      // });
      //

      let languages = [
        {
          name: 'اللغة العربية',
          lang_code: 'ar',
        },
        {
          name: 'اللغة الانكليزية',
          lang_code: 'en',
        },
        {
          name: 'اللغة الروسية',
          lang_code: 'ru',
        },
      ];
      await this.sequelizeConnection.transaction(async (transaction: any) => {
        // await PermissionTypes.bulkCreate(permissionTypes, { transaction });
        // await Permission.bulkCreate(permissions_db, { transaction });
        await this.LanguageRepository.bulkCreate(languages, { transaction });
        await this.roleRepository.bulkCreate(
          [
            {
              name: 'super_admin',
            },
            {
              name: 'admin',
            },
            {
              name: 'user',
            },
          ],
          { transaction },
        );

        //   let create_admin_permissions = [];
        //   create_admin_permissions = admin_permissions.map((item) => {
        //     return {
        //       role_id: admin.id,
        //       permission_id: item,
        //     };
        //   });

        //   let create_author_permissions = [];
        //   create_author_permissions = author_permissions.map((item) => {
        //     return {
        //       role_id: author.id,
        //       permission_id: item,
        //     };
        //   });
        //   let create_reviewer_permissions = [];
        //   create_reviewer_permissions = reviewer_permissions.map((item) => {
        //     return {
        //       role_id: reviewer.id,
        //       permission_id: item,
        //     };
        //   });

        //   await RolePermission.bulkCreate(create_admin_permissions, {
        //     transaction,
        //   });
        //   await RolePermission.bulkCreate(create_author_permissions, {
        //     transaction,
        //   });
        //   await RolePermission.bulkCreate(create_reviewer_permissions, {
        //     transaction,
        //   });
        const default_company = await this.companyRepository.create(
          {
            name: 'default',
          },
          { transaction },
        );
        const default_admin = await this.UserRepository.create(
          {
            user_name: 'admin',
            email: null,
            phone_number: null,
            password: 'Admin@123',
            address: 'syria',
            lang_id: 1,
            role_id: 1,
            company_id: default_company.id,
          },
          { transaction },
        );
      });
    }
  }
}
