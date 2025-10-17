import { Task, TaskListType } from "@prisma/client";

import { IsArray, IsEnum, IsString } from "class-validator";

interface TaskWithIndex extends Task {
  index: number;
}

export class UpdateTasksIndexesDto {
  @IsString()
  @IsEnum(TaskListType)
  listType: TaskListType;

  @IsArray()
  tasks: TaskWithIndex[];
}