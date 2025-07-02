import { Table, Column, DataType, Model, HasMany } from 'sequelize-typescript';

import { User } from 'src/user/entities/user.entity';

@Table({
  tableName: 'companies',
  timestamps: true,
})
export class Company extends Model {
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
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'no logo found',
  })
  logo: string;
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  reset_logo: boolean;
  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: '#FF0000,#00FF00,#0000FF,#FFFFFF',
  })
  colors: string;
  @Column({
    type: DataType.TIME,
    allowNull: false,
    defaultValue: '08:00:00',
  })
  start_work_at: string;
  @Column({
    type: DataType.TIME,
    allowNull: false,
    defaultValue: '16:00:00',
  })
  end_work_at: string;
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 8,
  })
  work_hours: number;
  // ###################################
  @HasMany(() => User, {
    constraints: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    hooks: true,
  })
  User: User[];
}
