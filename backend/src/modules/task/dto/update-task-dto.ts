import { IsBoolean, IsOptional, IsString } from "class-validator";

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  note?: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;

  @IsOptional()
  date?: Date;
}
