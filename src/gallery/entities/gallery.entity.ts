// src/user/user.model.ts

import {
  Table,
  Column,
  DataType,
  HasMany,
  BeforeCreate,
  Model,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';

import { User } from 'src/user/entities/user.entity';

@Table({ tableName: 'gallery', timestamps: true })
export class Gallery extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  file_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  base_name: string;

  // #######################################
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  created_by: number;
  @BelongsTo(() => User)
  createdBy: User;
}
