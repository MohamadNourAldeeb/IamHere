import { Table, Column, DataType, HasMany, Model } from 'sequelize-typescript';

import { User } from 'src/user/entities/user.entity';

@Table({
  tableName: 'languages',
  timestamps: true,
})
export class Language extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    unique: 'unique_field',
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  lang_code: string;

  // ################################
  @HasMany(() => User, {
    constraints: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    hooks: true,
    foreignKey: 'lang_id',
  })
  users: User[];
}
