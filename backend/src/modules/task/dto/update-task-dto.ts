import { IsBoolean, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateTaskDto {
  @ApiProperty({ example: "Buy milk", required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ example: "2% fat", required: false })
  @IsString()
  @IsOptional()
  note?: string;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  completed?: boolean;

  @ApiProperty({ example: "2024-12-31T23:59:59Z", required: false })
  @IsOptional()
  date?: Date;
}
