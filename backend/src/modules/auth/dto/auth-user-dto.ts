import { IsString, IsOptional, IsEmail } from "class-validator";
import { UserAuthType } from "@prisma/client";

import { ApiProperty } from "@nestjs/swagger";

export class AuthUserDto {
  @ApiProperty({
    example: "email",
    required: true,
    enum: ["email", "google"],
  })
  @IsString()
  authType: UserAuthType;
}

export class SignInDto extends AuthUserDto {
  @ApiProperty({ example: "test@test.test", required: true })
  @IsString()
  email: string;

  @ApiProperty({ example: "123456", required: true })
  @IsString()
  password: string;
}

export class SignUpDto extends SignInDto {
  @ApiProperty({ example: "User first name", required: true })
  @IsString()
  @IsOptional()
  firstName: string;

  @ApiProperty({ example: "", required: true })
  @IsString()
  @IsOptional()
  lastName: string;

  @ApiProperty({ example: "test@test.test", required: true })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "123456", required: true })
  @IsString()
  password: string;
}
