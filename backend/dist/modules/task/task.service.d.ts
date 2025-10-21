import { DatabaseService } from "../database/database.service";
import { TaskListType } from "@prisma/client";
import { CreateTaskDto } from "./dto/create-task-dto";
import { UpdateTaskDto } from "./dto/update-task-dto";
import { UpdateTasksIndexesDto } from "./dto/update-tasks-indexes-dto";
export declare class TaskService {
    private readonly database;
    constructor(database: DatabaseService);
    create(createTaskDto: {
        taskListType: TaskListType;
        task: CreateTaskDto;
    }): Promise<{
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
    }>;
    updateTaskListId(taskId: string, taskListId: string): Promise<void>;
    updateTasksIndexes(updateTasksIndexesDto: UpdateTasksIndexesDto): Promise<{
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
    }[]>;
    findByTaskListId(id: string): Promise<({
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
    })[]>;
    findAllUserTasks(userId: string): Promise<({
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
    })[]>;
    findOneTask(id: string): Promise<{
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
    }>;
    updateTask(id: string, updateTaskDto: UpdateTaskDto): Promise<void>;
    removeTask(id: string): Promise<void>;
    getHomeTasks(userId: string): Promise<({
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
    })[]>;
    getTodayTasks(userId: string): Promise<void>;
    getCompletedTasks(userId: string): Promise<({
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
    })[]>;
    removeAllTasks(removeAllTasksDto: {
        userId: string;
        listType: TaskListType;
        listId: string;
    }): Promise<void>;
}
