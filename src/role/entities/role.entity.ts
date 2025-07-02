import {
  Table,
  Column,
  DataType,
  HasMany,
  BeforeCreate,
  Model,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { User } from "../../user/entities/user.entity";
import { RolePermission } from "./roles_permissions.entity";

@Table({ tableName: "roles", timestamps: false })
export class Role extends Model {
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
  name: string;

  @HasMany(() => User, {
    as: "user",
    constraints: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    hooks: true,
  })
  user: User[];

  @HasMany(() => RolePermission, {
    constraints: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    hooks: true,
    as: "permissions",
  })
  role_permission: RolePermission[];
}
