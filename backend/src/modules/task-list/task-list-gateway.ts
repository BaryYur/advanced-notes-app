import { UseGuards } from "@nestjs/common";

import { TaskListType, User } from "@prisma/client";

import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WsResponse,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server } from "socket.io";

import { TaskListService } from "./task-list.service";

import { WsJwtGuard } from "../auth/ws-jwt-auth.guard";

import { CreateTaskListDto } from "./dto/create-task-list-dto";
import { UpdateTaskListDto } from "./dto/update-task-list-dto";

import { CurrentWsUser } from "../../common/decorators/ws-user.decorator";

@WebSocketGateway({
  // namespace: "task-list",
})
export class TaskListGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly taskListService: TaskListService) {}

  @UseGuards(WsJwtGuard)
  @SubscribeMessage("getTaskList")
  async getTaskList(
    @MessageBody() getTaskListDto: { name: string },
    @CurrentWsUser() user: User,
  ) {
    const taskList = await this.taskListService.findTaskList(
      user.id,
      getTaskListDto.name,
    );

    this.server.emit("taskListFetched", taskList);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage("createTaskList")
  async createTaskList(
    @MessageBody() dto: CreateTaskListDto,
    @CurrentWsUser() user: User,
  ) {
    const taskList = await this.taskListService.createTaskList(user.id, dto);

    this.server.emit("taskListCreated", taskList);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage("updateTaskList")
  async updateTaskList(
    @MessageBody()
    updateTaskListDto: {
      taskListId: string;
      data: UpdateTaskListDto;
    },
  ) {
    if (updateTaskListDto.taskListId) {
      const taskList = await this.taskListService.updateTaskList(
        updateTaskListDto.taskListId,
        updateTaskListDto.data,
      );

      this.server.emit("taskListUpdated", taskList);
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage("getTaskListsByUserId")
  async getTaskListsByUserId(
    @MessageBody() userId: string,
  ): Promise<WsResponse<any>> {
    const taskLists = await this.taskListService.findTaskListsByUserId(userId);

    return { event: "taskListsByUserId", data: taskLists };
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage("deleteTaskList")
  async deleteTaskList(@MessageBody() id: string) {
    await this.taskListService.deleteTaskList(id);

    this.server.emit("taskListDeleted", id);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage("deleteAllListTasks")
  async deleteTaskListTasks(
    @MessageBody()
    deleteDto: {
      taskListId?: string;
      taskListType: TaskListType;
    },
  ) {
    await this.taskListService.deleteAllTaskListTasks(deleteDto);

    // this.server.emit("taskListAllTasksDeleted", );
  }
}
