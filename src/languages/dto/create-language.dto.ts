import { IsEnum, IsString, Length } from 'class-validator';
import { LanguageCodesType } from 'src/common/enums/enums';
export class CreateLanguageDto {
  @IsString()
  @Length(2, 100, {
    message: 'name must be between 2 and 100',
  })
  name: string;
  @IsEnum(LanguageCodesType)
  lang_code: LanguageCodesType;
}
