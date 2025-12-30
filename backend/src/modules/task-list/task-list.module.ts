import { Module } from "@nestjs/common";

import { TaskListService } from "./task-list.service";
import { TaskListGateway } from "./task-list-gateway";
import { UserService } from "../user/user.service";

@Module({
  imports: [],
  controllers: [],
  providers: [TaskListService, TaskListGateway, UserService],
  exports: [],
})
export class TaskListModule {}
