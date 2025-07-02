import {
  Table,
  Column,
  DataType,
  HasMany,
  BeforeCreate,
  Model,
  ForeignKey,
  BelongsTo,
  BeforeUpdate,
} from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';
import { RefreshToken } from './refresh_token.entity';
import { Role } from '../../role/entities/role.entity';
import { ActivityLogs } from './activity_log.entity';
import { Gallery } from 'src/gallery/entities/gallery.entity';

import { UserPermission } from './user_permission.entity';
import { EmployeeRecord } from 'src/employee_record/entities/employee_record.entity';
import { Language } from 'src/languages/entities/language.entity';
import { Company } from 'src/company/entities/company.entity';

@Table({ tableName: 'user', timestamps: true })
export class User extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: 'unique_user_name',
  })
  user_name: string;

  @Column({
    type: DataType.STRING,
    unique: 'unique_email',
    allowNull: true,
  })
  email: string;
  @Column({
    type: DataType.STRING,
    unique: 'unique_phone',
    allowNull: true,
  })
  phone_number: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  address: string;

  // ###################################
  @ForeignKey(() => Role)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  role_id: number;
  @BelongsTo(() => Role, { as: 'role_info' })
  role!: Role;
  // ###################################

  @HasMany(() => ActivityLogs, {
    constraints: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    hooks: true,
  })
  activityLogs: ActivityLogs[];
  // ###################################

  @ForeignKey(() => Language)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  lang_id: number;
  @BelongsTo(() => Language, { as: 'lang_id_info', foreignKey: 'lang_id' })
  LanguageId: Language;
  // ###################################

  @HasMany(() => EmployeeRecord, {
    constraints: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    hooks: true,
    foreignKey: 'user_id',
  })
  EmployeeRecord: EmployeeRecord[];
  // ###################################

  @HasMany(() => EmployeeRecord, {
    constraints: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    hooks: true,
    foreignKey: 'created_by',
  })
  CreatedByRecord: EmployeeRecord[];

  // #########################################33
  @HasMany(() => Gallery, {
    constraints: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    hooks: true,
  })
  createdBy: Gallery[];

  // ###################################
  @HasMany(() => UserPermission, {
    constraints: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    hooks: true,
    foreignKey: 'user_id',
  })
  userPermission: UserPermission[];
  // ###################################
  @HasMany(() => RefreshToken, {
    constraints: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    hooks: true,
  })
  refreshTokens: RefreshToken[];
  // ###################################
  @ForeignKey(() => Company)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  company_id: number;
  @BelongsTo(() => Company, { as: 'company_info', foreignKey: 'company_id' })
  CompanyId: Company;

  @BeforeCreate
  static async hashPassword(user: User): Promise<void> {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    }
  }

  @BeforeUpdate
  static async hashPasswordUpdate(user: User): Promise<void> {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    }
  }
}
