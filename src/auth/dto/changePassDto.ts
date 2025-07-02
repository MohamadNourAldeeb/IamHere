import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';
export class changePassDto {
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 8,
    minNumbers: 3,
    minSymbols: 1,
    minUppercase: 1,
  })
  old_password: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 8,
    minNumbers: 3,
    minSymbols: 1,
    minUppercase: 1,
  })
  new_password: string;
}
