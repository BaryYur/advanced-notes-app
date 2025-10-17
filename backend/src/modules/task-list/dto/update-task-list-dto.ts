import { IsOptional, IsString } from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

export class UpdateTaskListDto {
  @ApiProperty({ example: "Task list 1" })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: "rgb(256,256,256)" })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiProperty({ example: "🏠" })
  @IsString()
  @IsOptional()
  emoji?: string;
}