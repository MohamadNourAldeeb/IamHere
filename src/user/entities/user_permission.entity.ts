import {
    Table,
    Column,
    DataType,
    Model,
    ForeignKey,
    BelongsTo,
} from 'sequelize-typescript'
import { User } from './user.entity'
import { Permission } from '../../permission/entities/permission.entity'
import { userPermissionsType } from 'src/common/enums/enums'

@Table({ tableName: 'user_permissions', timestamps: true })
export class UserPermission extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    id: number
    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    user_id: number

    @BelongsTo(() => User)
    user: User
    @ForeignKey(() => Permission)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    permission_id: number
    @BelongsTo(() => Permission)
    permission!: Permission

    @Column({
        type: DataType.STRING,
        allowNull: false, // Default value from the enum
    })
    type: userPermissionsType
}
