import { Controller } from "@nestjs/common";

import { TaskService } from "./task.service";

import { ApiTags } from "@nestjs/swagger";

@ApiTags("Task")
@Controller("task")
export class TaskController {
  constructor(private readonly taskService: TaskService) {}
}
