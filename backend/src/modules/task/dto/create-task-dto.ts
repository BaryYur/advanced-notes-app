import { IsDate, IsOptional, IsString } from "class-validator";

import { TaskListType } from "@prisma/client";

import { ApiProperty } from "@nestjs/swagger"; 

export class CreateTaskDto {
  @IsString()
  taskListType: TaskListType;

  @ApiProperty({ example: "id1", required: true })
  @IsString()
  userId: string;

  @ApiProperty({ example: "id1", required: false })
  @IsString()
  @IsOptional()
  taskListId?: string;

  @ApiProperty({ example: "Task 1", required: true })
  @IsString()
  title: string;

  @ApiProperty({ example: "", required: true })
  @IsDate()
  date: Date;
}
