import {
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsString,
    Length,
} from 'class-validator'

export class CreateRoleDto {
    @IsString()
    @IsNotEmpty({ message: 'role_name must not be empty' })
    role_name: string

    @IsArray()
    @IsNumber({}, { each: true })
    permissions: number[]
}
