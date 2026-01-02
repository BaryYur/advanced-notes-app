import { IsEmail, IsNumber, IsString } from "class-validator";

export class ResetPasswordDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsNumber()
  verificationCode: number;

  @IsString()
  newPassword: string;
}

export class ResetPasswordCodeDto {
  @IsString()
  @IsEmail()
  email: string;
}
