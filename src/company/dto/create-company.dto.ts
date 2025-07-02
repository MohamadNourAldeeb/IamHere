import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  @Length(8, 100, {
    message: 'password must be between 8 and 100',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 100, {
    message: 'user_name must be between 2 and 100',
  })
  user_name: string;

  @IsString()
  @IsOptional()
  @Length(2, 100, {
    message: 'user_name must be between 2 and 100',
  })
  email: string | null;

  @IsString()
  @IsOptional()
  @Matches(/^\+?[0-9\s\-\(\)]{6,}$/, {
    message: 'Phone number must be valid and include country code if necessary',
  })
  phone_number: string | null;
  @IsString()
  @IsNotEmpty()
  @Length(2, 100, {
    message: 'company_name must be between 2 and 100',
  })
  company_name: string;
  @IsString()
  @IsNotEmpty()
  @Length(31, 31, {
    message: 'colors must be 31 character',
  })
  colors: string;
  @IsNumber()
  @IsNotEmpty()
  work_hours: number;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{2}:\d{2}:\d{2}$/, {
    message: 'start_work_at not match the regex',
  })
  start_work_at: string;
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{2}:\d{2}:\d{2}$/, {
    message: 'end_work_at not match the regex',
  })
  end_work_at: string;
}
