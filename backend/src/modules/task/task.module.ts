import { Module } from "@nestjs/common";

import { TaskService } from "./task.service";
import { TaskGateway } from "./task-gateway";
import { TaskListService } from "../task-list/task-list.service";
import { UserService } from "../user/user.service";

@Module({
  controllers: [],
  providers: [TaskService, TaskGateway, TaskListService, UserService],
})
export class TaskModule {}
