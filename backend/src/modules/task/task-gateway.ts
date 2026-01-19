import { UseGuards } from "@nestjs/common";

import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server } from "socket.io";

import { TaskListType, User } from "@prisma/client";

import { TaskService } from "./task.service";
import { TaskListService } from "./../task-list/task-list.service";
import { WsJwtGuard } from "../auth/ws-jwt-auth.guard";

import { CreateTaskDto } from "./dto/create-task-dto";
import { UpdateTasksIndexesDto } from "./dto/update-tasks-indexes-dto";
import { UpdateTaskDto } from "./dto/update-task-dto";

import { CurrentWsUser } from "../../common/decorators/ws-user.decorator";

@WebSocketGateway({
  // namespace: "task",
})
export class TaskGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly taskService: TaskService,
    private readonly taskListService: TaskListService,
  ) {}

  @UseGuards(WsJwtGuard)
  @SubscribeMessage("createTask")
  async createTaskList(
    @MessageBody()
    createTaskDto: {
      taskListType: TaskListType;
      task: CreateTaskDto;
    },
  ) {
    const task = await this.taskService.create(createTaskDto);

    this.server.emit("taskCreated", task);

    const taskLists = await this.taskListService.findTaskListsByUserId(
      createTaskDto.task.userId,
    );
    this.server.emit("taskListsByUserId", taskLists);
    // get completed, home, today

    const tasks = await this.taskService.findAllUserTasks(
      createTaskDto.task.userId,
    );

    return { event: "userHomeTasks", data: tasks };
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage("getListTasks")
  async getListTasks(
    @MessageBody() _taskListId: string,
    @CurrentWsUser() _user: User,
  ) {
    // const tasks = await this.taskService.findByTaskListId(taskListId);
    // const orderedTasks = tasks.sort((a, b) => a.defaultIndex - b.defaultIndex);
    // return { event: "userListTasks", data: orderedTasks };
  }

  @SubscribeMessage("getHomeTasks")
  async getHomeTasks(@MessageBody() userId: string) {
    const tasks = await this.taskService.getHomeTasks(userId);

    return { event: "userHomeTasks", data: tasks };
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage("updateTaskIndexes")
  async updateTaskIndexes(
    @MessageBody() updateTasksIndexesDto: UpdateTasksIndexesDto,
  ) {
    const tasks = await this.taskService.updateTasksIndexes(
      updateTasksIndexesDto,
    );

    return { event: "taskIndexesUpdated", data: tasks };
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage("updateTask")
  async updateTask(
    @MessageBody()
    _updateDto: {
      id: string;
      task: UpdateTaskDto;
    },
  ) {
    // await this.taskService.updateTask(updateDto.id, updateDto.task);
    // const task = await this.taskService.findOneTask(updateDto.id);
    // if (!task) throw new NotFoundException("Task not found");
    // const taskLists = await this.taskListService.findTaskListsByUserId(
    //   task.userId,
    // );
    // this.server.emit("taskListsByUserId", taskLists);
    // this.server.emit("taskUpdated", task);
    // const homeTasks = await this.taskService.getHomeTasks(task.userId);
    // this.server.emit("userHomeTasks", homeTasks);
    // const completedTasks = await this.taskService.getCompletedTasks(
    //   task.userId,
    // );
    // this.server.emit("userCompletedTasks", completedTasks);
    // if (!task.taskListId) throw new NotFoundException("Task list ID not found");
    // const listTasks = await this.taskService.findByTaskListId(task.taskListId);
    // const orderedTasks = listTasks.sort(
    //   (a, b) => a.defaultIndex - b.defaultIndex,
    // );
    // return { event: "userListTasks", data: orderedTasks };
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage("getCompletedTasks")
  async getCompletedTasksByUserId(@MessageBody() userId: string) {
    const taskLists = await this.taskService.getCompletedTasks(userId);

    return { event: "userCompletedTasks", data: taskLists };
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage("removeAllTasks")
  async removeAllTasks(
    @MessageBody()
    removeAllTasksDto: {
      userId: string;
      listType: TaskListType;
      listId: string;
    },
  ) {
    await this.taskService.removeAllTasks(removeAllTasksDto);

    // update completed, home, today
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage("removeTask")
  async removeTask(
    @MessageBody()
    _removeTaskDto: {
      id: string;
    },
  ) {
    // const task = await this.taskService.findOneTask(removeTaskDto.id);
    // if (!task) throw new NotFoundException("Task not found");
    // await this.taskService.removeTask(removeTaskDto.id);
    // const homeTasks = await this.taskService.getHomeTasks(task.userId);
    // this.server.emit("userHomeTasks", homeTasks);
    // const completedTasks = await this.taskService.getCompletedTasks(
    //   task.userId,
    // );
    // this.server.emit("userCompletedTasks", completedTasks);
    // if (!task.taskListId) throw new NotFoundException("Task list ID not found");
    // const listTasks = await this.taskService.findByTaskListId(task.taskListId);
    // const orderedTasks = listTasks.sort(
    //   (a, b) => a.defaultIndex - b.defaultIndex,
    // );
    // const taskListsByUserId = await this.taskListService.findTaskListsByUserId(
    //   task.userId,
    // );
    // console.log(taskListsByUserId, "by user");
    // this.server.emit("taskListsByUserId", taskListsByUserId);
    // return { event: "userListTasks", data: orderedTasks };
  }
}
