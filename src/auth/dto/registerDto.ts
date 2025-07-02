import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Matches,
} from "class-validator";
import { deviceType } from "src/common/enums/enums";
export class registerDto {
  @IsEmail()
  email: string;
  @IsString()
  @IsNotEmpty()
  @Length(8, 100, {
    message: "password must be between 8 and 100",
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 100, {
    message: "user_name must be between 2 and 100",
  })
  user_name: string;
  @IsString()
  @IsNotEmpty()
  @Length(2, 100, {
    message: "address must be between 2 and 100",
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

  @IsNumber()
  @IsNotEmpty()
  role_id: number;

  @IsString()
  @IsNotEmpty()
  device_serial: string;

  @IsEnum(deviceType)
  device_type: deviceType;
}
