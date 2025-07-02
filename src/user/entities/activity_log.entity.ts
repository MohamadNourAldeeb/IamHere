// src/user/user.model.ts

import {
  Table,
  Column,
  DataType,
  Model,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { User } from "./user.entity";

@Table({ tableName: "activity_log", timestamps: true })
export class ActivityLogs extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  type: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description: string;
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
