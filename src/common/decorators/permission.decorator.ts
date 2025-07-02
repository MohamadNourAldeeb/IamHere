import { SetMetadata } from '@nestjs/common'
import { Role } from '../enums/enums'

export const Permission_KEY = 'permissions'
export const Permissions = (permissions: number[]) =>
    SetMetadata(Permission_KEY, permissions)
