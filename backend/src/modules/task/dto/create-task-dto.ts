import { IsDate, IsOptional, IsString } from "class-validator";

import { TaskListType } from "@prisma/client";

import { ApiProperty } from "@nestjs/swagger";

export class CreateTaskDto {
  @ApiProperty({
    enum: TaskListType,
    example: TaskListType.default,
    description: "Type of the task list",
  })
  @IsString()
  taskListType: TaskListType;

  @ApiProperty({
    example: "550e8400-e29b-41d4-a716-446655440000",
    description: "ID of the user who owns the task",
  })
  @IsString()
  userId: string;

  @ApiProperty({
    example: "550e8400-e29b-41d4-a716-446655440000",
    description: "Optional ID of the task list",
    required: false,
  })
  @IsString()
  @IsOptional()
  taskListId?: string;

  @ApiProperty({
    example: "Buy groceries",
    description: "Title of the task",
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: "2024-12-31T23:59:59Z",
    description: "Due date of the task",
    required: false,
  })
  @IsDate()
  @IsOptional()
  date?: Date;
}
