import { ConfigService } from "@nestjs/config";

import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WsResponse,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server } from "socket.io";

import { TaskListService } from "./task-list.service";

import { CreateTaskListDto } from "./dto/create-task-list-dto";
import { UpdateTaskListDto } from "./dto/update-task-list-dto";
import { TaskListType } from "@prisma/client";

// const configService = new ConfigService();

@WebSocketGateway(4001, {
  cors: {
    // origin: configService.get("FRONTEND_DOMAIN"),
    origin: "*",
  },
})
export class TaskListGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly taskListService: TaskListService) {}

  @SubscribeMessage("getTaskList")
  async getTaskList(
    @MessageBody() getTaskListDto: { userId: string; name: string },
  ) {
    const taskList = await this.taskListService.findTaskList(
      getTaskListDto.userId,
      getTaskListDto.name,
    );

    this.server.emit("taskListFetched", taskList);
  }

  @SubscribeMessage("createTaskList")
  async createTaskList(@MessageBody() createTaskListDto: CreateTaskListDto) {
    const taskList =
      await this.taskListService.createTaskList(createTaskListDto);

    this.server.emit("taskListCreated", taskList);
  }

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

  @SubscribeMessage("getTaskListsByUserId")
  async getTaskListsByUserId(
    @MessageBody() userId: string,
  ): Promise<WsResponse<any>> {
    const taskLists = await this.taskListService.findTaskListsByUserId(userId);

    return { event: "taskListsByUserId", data: taskLists };
  }

  @SubscribeMessage("deleteTaskList")
  async deleteTaskList(@MessageBody() id: string) {
    await this.taskListService.deleteTaskList(id);

    this.server.emit("taskListDeleted", id);
  }

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
