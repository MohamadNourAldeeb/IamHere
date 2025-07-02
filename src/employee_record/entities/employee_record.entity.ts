import {
  Table,
  Column,
  DataType,
  Model,
  ForeignKey,
  BelongsTo,
  Sequelize,
} from 'sequelize-typescript';

import { User } from 'src/user/entities/user.entity';

@Table({
  tableName: 'employee_records',
  timestamps: true,
  indexes: [
    {
      name: 'unique_user_date',
      unique: true,
      fields: ['user_id', 'createdAt'],
    },
  ],
})
export class EmployeeRecord extends Model {
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
  state: string;

  // ###################################

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  user_id: number;
  @BelongsTo(() => User, {
    as: 'employee_info',
    foreignKey: 'user_id',
  })
  employeeId: User;

  // ###################################
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  created_by: number;
  @BelongsTo(() => User, { as: 'created_by_info', foreignKey: 'created_by' })
  createdBy!: User;
  // ###################################
}
