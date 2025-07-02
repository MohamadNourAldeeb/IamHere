import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsStrongPassword,
  Length,
  Matches,
  MAX,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 8,
    minNumbers: 3,
    minSymbols: 1,
    minUppercase: 1,
  })
  password: string;

  @IsString({ message: 'user_name must be a string' })
  @IsNotEmpty()
  @Length(4, 50, {
    message: 'user_name must be between 4 and 50',
  })
  @Matches(/^[a-zA-Z][a-zA-Z0-9_]{2,19}$/, {
    message: 'user name must be valid regex type',
  })
  user_name: string;

  @IsString()
  @IsOptional()
  @Length(2, 100, {
    message: 'address must be between 2 and 100',
  })
  address: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\+[1-9]\d{1,14}$/, {
    message: 'Phone number must be valid and include country code if necessary',
  })
  phone_number: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @IsInt({
    message: 'lang_id must be a integer',
  })
  lang_id: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @IsInt({
    message: 'role_id must be a integer',
  })
  role_id: number;
}
