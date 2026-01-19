import { IsString, IsOptional, IsEmail, IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { UserAuthType } from "@prisma/client";

export class SignInDto {
  @ApiProperty({
    example: "user@example.com",
    description: "The email of the user",
  })
  @IsEmail()
  @IsString()
  email: string;

  @ApiProperty({
    example: "password123",
    description: "The password of the user",
    required: false,
  })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({
    enum: UserAuthType,
    example: UserAuthType.email,
    description: "Authentication type",
  })
  @IsString()
  @IsEnum(UserAuthType)
  authType: UserAuthType;
}

export class SignUpDto extends SignInDto {
  @ApiProperty({
    example: "John",
    description: "First name of the user",
    required: false,
  })
  @IsString()
  @IsOptional()
  firstName: string;

  @ApiProperty({
    example: "Doe",
    description: "Last name of the user",
    required: false,
  })
  @IsString()
  @IsOptional()
  lastName: string;
}
