import { WsResponse } from "@nestjs/websockets";
import { Server } from "socket.io";
import { TaskListService } from "./task-list.service";
import { CreateTaskListDto } from "./dto/create-task-list-dto";
import { UpdateTaskListDto } from "./dto/update-task-list-dto";
import { TaskListType } from "@prisma/client";
export declare class TaskListGateway {
    private readonly taskListService;
    server: Server;
    constructor(taskListService: TaskListService);
    getTaskList(getTaskListDto: {
        userId: string;
        name: string;
    }): Promise<void>;
    createTaskList(createTaskListDto: CreateTaskListDto): Promise<void>;
    updateTaskList(updateTaskListDto: {
        taskListId: string;
        data: UpdateTaskListDto;
    }): Promise<void>;
    getTaskListsByUserId(userId: string): Promise<WsResponse<any>>;
    deleteTaskList(id: string): Promise<void>;
    deleteTaskListTasks(deleteDto: {
        taskListId?: string;
        taskListType: TaskListType;
    }): Promise<void>;
}
