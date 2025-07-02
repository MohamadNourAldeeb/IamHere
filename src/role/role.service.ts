import { HttpStatus, Injectable } from '@nestjs/common'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { Request, Response } from 'express'
import { Role } from './entities/role.entity'
import { CustomException } from 'src/common/constant/custum-error'
import { Permission } from 'src/permission/entities/permission.entity'
import { InjectConnection } from '@nestjs/sequelize'
import { Sequelize } from 'sequelize-typescript'
import { RolePermission } from './entities/roles_permissions.entity'
import { Op } from 'sequelize'

let findDifference = (arr1: number[], arr2: number[]) => {
    const forDelete = arr1.filter((item: number) => !arr2.includes(item))
    const forCreate = arr2.filter((item: number) => !arr1.includes(item))
    return { forDelete, forCreate }
}

@Injectable()
export class RoleService {
    constructor(@InjectConnection() private sequelizeConnection: Sequelize) {}
    async create(createRoleDto: CreateRoleDto, req: Request, res: Response) {
        createRoleDto.permissions = Array.from(
            new Set(createRoleDto.permissions)
        )
        if (
            await Role.findOne({
                raw: true,
                where: { name: createRoleDto.role_name },
            })
        )
            throw new CustomException(`this role already exist 🤨`)

        if (createRoleDto.permissions.length == 0)
            throw new CustomException(
                `you should add some permissions to this role🤨`
            )

        await Promise.all(
            createRoleDto.permissions.map(async (item: any) => {
                if (
                    !(await Permission.findOne({
                        raw: true,
                        attributes: ['id'],
                        where: { id: item },
                    }))
                )
                    throw new CustomException(
                        `this permission Id ${item} not found 🤨`
                    )
            })
        )

        await this.sequelizeConnection.transaction(async (transaction: any) => {
            let role: any = await Role.create(
                { name: createRoleDto.role_name },
                { transaction }
            )

            let permissions_role_creation = []
            permissions_role_creation = createRoleDto.permissions.map(
                (item: any) => {
                    return {
                        role_id: role.id,
                        permission_id: item,
                    }
                }
            )
            await RolePermission.bulkCreate(permissions_role_creation, {
                transaction,
            })
        })

        return res.status(HttpStatus.CREATED).send({
            success: true,
            data: {
                message: 'operation accomplished successfully',
            },
        })
    }

    async findAll(req: Request, res: Response) {
        let data: any = await Role.findAll({
            raw: true,
            nest: true,
            include: [
                {
                    model: RolePermission,
                    required: true,
                    attributes: [],
                    include: [
                        {
                            model: Permission,
                            required: true,
                            attributes: {
                                exclude: ['createdAt', 'updatedAt'],
                            },
                        },
                    ],
                },
            ],
        })

        data = data.reduce((acc: any, item: any) => {
            const existingItem = acc.find((x: any) => x.id === item.id)

            // console.log(item)
            if (existingItem) {
                if (
                    !existingItem.permissions.includes({
                        id: item.permissions.permission.id,
                    }) &&
                    item.permissions.permission.id
                ) {
                    existingItem.permissions.push({
                        id: item.permissions.permission.id,
                        mode: item.permissions.permission.mode,
                        description: item.permissions.permission.description,
                    })
                }
            } else {
                let permissions: any = []
                if (permissions.length == 0)
                    permissions.push({
                        id: item.permissions.permission.id,
                        mode: item.permissions.permission.mode,
                        description: item.permissions.permission.description,
                    })
                acc.push({
                    id: item.id,
                    name: item.name,
                    permissions,
                })
            }
            return acc
        }, [])

        return res.status(HttpStatus.OK).send({
            success: true,
            data,
        })
    }

    async update(
        id: number,
        updateRoleDto: UpdateRoleDto,
        req: Request,
        res: Response
    ) {
        updateRoleDto.permissions = Array.from(
            new Set(updateRoleDto.permissions)
        )
        if (updateRoleDto.permissions.length == 0)
            throw new CustomException(
                `you should add some permissions to this role🤨`
            )
        if (
            await Role.findOne({
                raw: true,
                where: {
                    name: updateRoleDto.role_name,
                    id: { [Op.not]: id },
                },
            })
        )
            throw new CustomException(`this role name already exist 🤨`)

        await Promise.all(
            updateRoleDto.permissions.map(async (item: any) => {
                if (
                    !(await Permission.findOne({
                        raw: true,
                        attributes: ['id'],
                        where: { id: item },
                    }))
                )
                    throw new CustomException(
                        `this permission Id ${item} not found 🤨`
                    )
            })
        )

        await this.sequelizeConnection.transaction(async (transaction: any) => {
            await Role.update(
                { name: updateRoleDto.role_name },
                { where: { id }, transaction }
            )
            let role_permission: any = await RolePermission.findAll({
                raw: true,
                where: { role_id: id },
            })
            role_permission = role_permission.map(
                (item: any) => item.permission_id
            )
            let different = findDifference(
                role_permission,
                updateRoleDto.permissions
            )
            if (different.forCreate.length != 0) {
                await Promise.all(
                    different.forCreate.map(async (item: any) => {
                        await RolePermission.create(
                            { role_id: id, permission_id: item },
                            { transaction }
                        )
                    })
                )
            }
            if (different.forDelete.length != 0) {
                await Promise.all(
                    different.forDelete.map(async (item: any) => {
                        await RolePermission.destroy({
                            where: { permission_id: item, role_id: id },
                            transaction,
                        })
                    })
                )
            }
        })

        return res.status(HttpStatus.OK).send({
            success: true,
            data: {
                message: 'operation accomplished successfully',
            },
        })
    }

    async remove(id: number, req: Request, res: Response) {
        if (
            !(await Role.findOne({
                raw: true,
                where: {
                    id: { [Op.not]: id },
                },
            }))
        )
            throw new CustomException(`this role not found 🤨`)

        await Role.destroy({ where: { id } })

        return res.status(HttpStatus.OK).send({
            success: true,
            data: {
                message: 'operation accomplished successfully',
            },
        })
    }
}
