import { Module } from "@nestjs/common";
import { TaskService } from "./task.service";
import { TaskController } from "./task.controller";
import { TaskGateway } from "./task-gateway";
import { TaskListService } from "../task-list/task-list.service";

@Module({
  controllers: [TaskController],
  providers: [TaskService, TaskGateway, TaskListService],
})
export class TaskModule {}
