import { Table, Column, DataType, HasMany, Model } from "sequelize-typescript";
import { RolePermission } from "../../role/entities/roles_permissions.entity";

@Table({ tableName: "permission", timestamps: true })
export class Permission extends Model {
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
  mode: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description: string;

  @HasMany(() => RolePermission, {
    constraints: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    hooks: true,
  })
  role_permission: RolePermission[];
}
