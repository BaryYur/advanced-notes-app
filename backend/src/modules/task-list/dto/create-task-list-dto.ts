import { IsOptional, IsString } from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

export class CreateTaskListDto {
  @ApiProperty({ example: "Task list 1", required: true })
  @IsString()
  name: string;

  @ApiProperty({ example: "🛒", required: false })
  @IsString()
  @IsOptional()
  emoji?: string;
}
