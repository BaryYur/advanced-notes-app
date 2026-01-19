import { ApiProperty } from "@nestjs/swagger";
import { UserAuthType } from "@prisma/client";

export class UserDto {
  @ApiProperty({ example: "550e8400-e29b-41d4-a716-446655440000" })
  id: string;

  @ApiProperty({ example: "John" })
  firstName: string;

  @ApiProperty({ example: "Doe" })
  lastName: string;

  @ApiProperty({ enum: UserAuthType, example: UserAuthType.email })
  authType: UserAuthType;

  @ApiProperty({ example: "user@example.com" })
  email: string;
}
