import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsOptional,
  IsPositive,
  Max,
  Min,
} from 'class-validator';
import { IsDateNotInFuture } from 'src/common/decorators/date-not-in-future.decorator';

export class getAllRecordsDto {
  @Type(() => Number)
  @IsInt({ message: 'page must be a number.' })
  @IsPositive({ message: 'page must be a positive number.' })
  @Min(1)
  page: number;

  @Type(() => Number)
  @IsInt({ message: 'size must be a number.' })
  @IsPositive({ message: 'size must be a positive number.' })
  @Min(1)
  @Max(1000)
  size: number;

  @Type(() => Number)
  @IsOptional()
  @IsPositive({ message: 'user_id must be a positive number.' })
  @IsInt({ message: 'user_id must be a number.' })
  @Min(1)
  @Max(100000)
  user_id: number;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  @IsDateNotInFuture()
  date?: Date | null;
}
