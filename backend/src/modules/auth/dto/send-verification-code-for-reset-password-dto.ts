import { IsEmail } from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

export class SendResetPasswordVerificationCodeDto {
  @ApiProperty({ example: "test@test.test", required: true })
  @IsEmail()
  email: string;
}
