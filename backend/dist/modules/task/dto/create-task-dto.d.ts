import { TaskListType } from "@prisma/client";
export declare class CreateTaskDto {
    taskListType: TaskListType;
    userId: string;
    taskListId?: string;
    title: string;
    date: Date;
}
