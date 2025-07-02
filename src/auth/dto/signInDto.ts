import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Length,
  Matches,
} from 'class-validator';
import { deviceType } from 'src/common/enums/enums';
export class signInDto {
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
  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 8,
    minNumbers: 3,
    minSymbols: 1,
    minUppercase: 1,
  })
  password: string;

  @IsString({ message: 'device_serial must be a string' })
  @Length(4, 100, {
    message: 'device_serial must be between 4 and 100',
  })
  @IsNotEmpty()
  device_serial: string;

  @IsEnum(deviceType)
  @IsNotEmpty()
  device_type: deviceType;
}
