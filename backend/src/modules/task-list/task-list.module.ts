import { Module } from "@nestjs/common";

import { TaskListController } from "./task-list.controller";
import { TaskListService } from "./task-list.service";
import { TaskListGateway } from "./task-list-gateway";

@Module({
  imports: [],
  controllers: [TaskListController],
  providers: [TaskListService, TaskListGateway],
  exports: [],
})
export class ClassRoomModule {}
