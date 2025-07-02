import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { IsClean } from 'src/common/decorators/is-clean.decorator';
import { Trim } from 'src/common/decorators/trim.devorator';

export class IdDto {
  @IsString()
  // @Length(10)
  _id: string;
}

export class PaginationQueries {
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
}

export class PaginationWithSearchQueries {
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

  @IsString()
  @MinLength(1)
  @MaxLength(500)
  @IsOptional()
  @Trim()
  @IsClean()
  q: string;
}
