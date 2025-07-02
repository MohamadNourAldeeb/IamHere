import { IsNotEmpty, IsString, Length } from 'class-validator'

export class IdDto {
    @IsString()
    @IsNotEmpty({ message: 'id must not be empty' })
    id: string
}
