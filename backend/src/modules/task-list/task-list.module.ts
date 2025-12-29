import { Module } from "@nestjs/common";

import { TaskListService } from "./task-list.service";
import { TaskListGateway } from "./task-list-gateway";

@Module({
  imports: [],
  controllers: [],
  providers: [TaskListService, TaskListGateway],
  exports: [],
})
export class ClassRoomModule {}
