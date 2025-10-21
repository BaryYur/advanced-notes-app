import { Server } from "socket.io";
import { TaskListType } from "@prisma/client";
import { TaskService } from "./task.service";
import { TaskListService } from "./../task-list/task-list.service";
import { CreateTaskDto } from "./dto/create-task-dto";
import { UpdateTasksIndexesDto } from "./dto/update-tasks-indexes-dto";
import { UpdateTaskDto } from "./dto/update-task-dto";
export declare class TaskGateway {
    private readonly taskService;
    private readonly taskListService;
    server: Server;
    constructor(taskService: TaskService, taskListService: TaskListService);
    createTaskList(createTaskDto: {
        taskListType: TaskListType;
        task: CreateTaskDto;
    }): Promise<{
        event: string;
        data: ({
            taskList: {
                name: string;
                id: string;
                color: string;
                emoji: string | null;
                tasksCounter: number;
                createdAt: Date;
                userId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            title: string;
            taskListId: string | null;
            completed: boolean;
            note: string;
            date: Date | null;
            homeIndex: number;
            todayIndex: number | null;
            completedIndex: number | null;
            defaultIndex: number | null;
        })[];
    }>;
    getListTasks(taskListId: string): Promise<{
        event: string;
        data: ({
            taskList: {
                name: string;
                id: string;
                color: string;
                emoji: string | null;
                tasksCounter: number;
                createdAt: Date;
                userId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            title: string;
            taskListId: string | null;
            completed: boolean;
            note: string;
            date: Date | null;
            homeIndex: number;
            todayIndex: number | null;
            completedIndex: number | null;
            defaultIndex: number | null;
        })[];
    }>;
    getHomeTasks(userId: string): Promise<{
        event: string;
        data: ({
            taskList: {
                name: string;
                id: string;
                color: string;
                emoji: string | null;
                tasksCounter: number;
                createdAt: Date;
                userId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            title: string;
            taskListId: string | null;
            completed: boolean;
            note: string;
            date: Date | null;
            homeIndex: number;
            todayIndex: number | null;
            completedIndex: number | null;
            defaultIndex: number | null;
        })[];
    }>;
    updateTaskIndexes(updateTasksIndexesDto: UpdateTasksIndexesDto): Promise<{
        event: string;
        data: {
            id: string;
            createdAt: Date;
            userId: string;
            title: string;
            taskListId: string | null;
            completed: boolean;
            note: string;
            date: Date | null;
            homeIndex: number;
            todayIndex: number | null;
            completedIndex: number | null;
            defaultIndex: number | null;
        }[];
    }>;
    updateTask(updateDto: {
        id: string;
        task: UpdateTaskDto;
    }): Promise<{
        event: string;
        data: ({
            taskList: {
                name: string;
                id: string;
                color: string;
                emoji: string | null;
                tasksCounter: number;
                createdAt: Date;
                userId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            title: string;
            taskListId: string | null;
            completed: boolean;
            note: string;
            date: Date | null;
            homeIndex: number;
            todayIndex: number | null;
            completedIndex: number | null;
            defaultIndex: number | null;
        })[];
    }>;
    getCompletedTasksByUserId(userId: string): Promise<{
        event: string;
        data: ({
            taskList: {
                name: string;
                id: string;
                color: string;
                emoji: string | null;
                tasksCounter: number;
                createdAt: Date;
                userId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            title: string;
            taskListId: string | null;
            completed: boolean;
            note: string;
            date: Date | null;
            homeIndex: number;
            todayIndex: number | null;
            completedIndex: number | null;
            defaultIndex: number | null;
        })[];
    }>;
    removeAllTasks(removeAllTasksDto: {
        userId: string;
        listType: TaskListType;
        listId: string;
    }): Promise<void>;
    removeTask(removeTaskDto: {
        id: string;
    }): Promise<{
        event: string;
        data: ({
            taskList: {
                name: string;
                id: string;
                color: string;
                emoji: string | null;
                tasksCounter: number;
                createdAt: Date;
                userId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            title: string;
            taskListId: string | null;
            completed: boolean;
            note: string;
            date: Date | null;
            homeIndex: number;
            todayIndex: number | null;
            completedIndex: number | null;
            defaultIndex: number | null;
        })[];
    }>;
}
