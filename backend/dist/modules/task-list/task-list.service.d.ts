import { TaskList, TaskListType } from "@prisma/client";
import { DatabaseService } from "../database/database.service";
import { CreateTaskListDto } from "./dto/create-task-list-dto";
import { UpdateTaskListDto } from "./dto/update-task-list-dto";
export declare class TaskListService {
    private readonly database;
    constructor(database: DatabaseService);
    createTaskList(createTaskListDto: CreateTaskListDto): Promise<TaskList>;
    findTaskList(userId: string, name: string): Promise<TaskList>;
    findTaskListsByUserId(userId: string): Promise<TaskList[]>;
    updateTaskList(taskListId: string, updateTaskListDto: UpdateTaskListDto): Promise<{
        name: string;
        id: string;
        color: string;
        emoji: string | null;
        tasksCounter: number;
        createdAt: Date;
        userId: string;
    }>;
    deleteTaskList(id: string): Promise<{
        message: string;
        deletedTaskList: {
            name: string;
            id: string;
            color: string;
            emoji: string | null;
            tasksCounter: number;
            createdAt: Date;
            userId: string;
        };
    }>;
    deleteAllTaskListTasks(deleteDto: {
        taskListId?: string;
        taskListType: TaskListType;
    }): Promise<void>;
}
