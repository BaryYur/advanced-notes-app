import { IsString } from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

export class UpdatePasswordDto {
  @ApiProperty({
    example: "password123",
    description: "The old password of the user",
    required: true,
  })
  @IsString()
  oldPassword: string;

  @ApiProperty({
    example: "password123",
    description: "The new password of the user",
    required: true,
  })
  @IsString()
  newPassword: string;
}
