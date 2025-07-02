import { IsJWT, IsNotEmpty } from 'class-validator';
export class RefreshTokenDto {
  @IsJWT({ message: 'refresh_token must be a jwt token' })
  @IsNotEmpty()
  refresh_token: string;
}
