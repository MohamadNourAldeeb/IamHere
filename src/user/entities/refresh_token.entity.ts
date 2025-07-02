// src/auth/refresh-token.model.ts

import {
  Table,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  BeforeCreate,
  Model,
} from "sequelize-typescript";
import { User } from "./user.entity";
import { EncryptionService } from "src/common/services/encrypt.service";

@Table({ tableName: "refresh_tokens" })
export class RefreshToken extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING(1000),
    allowNull: false,
  })
  token: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  user_id: number;

  @BelongsTo(() => User)
  user: User;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  expiry: Date;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  device_serial: string;
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  device_type: string;

  @BeforeCreate
  static async hashToken(refreshToken: RefreshToken): Promise<void> {
    refreshToken.token = await EncryptionService.encryptToken(
      refreshToken.token
    );
  }
}
