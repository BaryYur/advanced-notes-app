import { Task, TaskListType } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsString } from "class-validator";

interface TaskWithIndex extends Task {
  index: number;
}

export class UpdateTasksIndexesDto {
  @ApiProperty({ enum: TaskListType, example: TaskListType.default })
  @IsString()
  @IsEnum(TaskListType)
  listType: TaskListType;

  @ApiProperty({
    description: "Array of tasks with their new indexes",
    type: "array",
    items: { type: "object" },
  })
  @IsArray()
  tasks: TaskWithIndex[];
}
