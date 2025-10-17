import { Controller } from "@nestjs/common";

import { ApiTags } from "@nestjs/swagger";

@ApiTags("Task list")
@Controller("task-list")
export class TaskListController {}
