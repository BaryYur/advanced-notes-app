import {
  IsString,
  IsOptional,
  IsEmail,
  MinLength,
  IsEnum,
} from "class-validator";

import { UserAuthType } from "@prisma/client";

export class SignInDto {
  @IsEmail()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsString()
  @IsEnum(UserAuthType)
  authType: UserAuthType;
}

export class SignUpDto extends SignInDto {
  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;
}
