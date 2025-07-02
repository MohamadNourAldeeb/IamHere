import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
  IsArray,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  @Length(2, 100, {
    message: 'user_name must be between 2 and 100',
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
  // @Matches(/^\+?[1-9]\d{1,14}$/, {
  //   message: "Phone number must be valid and include country code if necessary",
  // })
  phone_number: string;

  @IsNumber()
  @IsNotEmpty()
  lang_id: number;
}
