import { IsEmail, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ResetPasswordDto {
  @ApiProperty({
    example: "user@example.com",
    description: "The email of the user",
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 123456,
    description: "The verification code sent to the email",
  })
  @IsNumber()
  verificationCode: number;

  @ApiProperty({
    example: "newPassword123",
    description: "The new password for the account",
  })
  @IsString()
  newPassword: string;
}

export class ResetPasswordCodeDto {
  @ApiProperty({
    example: "user@example.com",
    description: "The email of the user",
  })
  @IsString()
  @IsEmail()
  email: string;
}
