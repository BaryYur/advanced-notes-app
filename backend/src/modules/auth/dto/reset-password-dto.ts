import { IsString } from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

export class ResetPasswordDto {
  @ApiProperty({ example: "test@test.test", required: true })
  @IsString()
  email: string;

  @ApiProperty({ example: 111111, required: true })
  @IsString()
  verificationCode: number;

  @ApiProperty({ example: 111111, required: true })
  @IsString()
  newPassword: string;
}
