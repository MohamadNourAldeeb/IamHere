import {
    Min,
    IsInt,
    IsOptional,
    IsNumber,
    IsBoolean,
    Max,
} from 'class-validator'

export class FindAllActivityLogsDto {
    @IsNumber()
    @IsInt()
    @Min(1, { message: 'page must be greater than or equal to 1' })
    page: number

    @IsNumber()
    @IsInt()
    @Min(1, { message: 'size must be greater than or equal to 1' })
    @Max(30)
    size: number
}
