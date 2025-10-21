import { Task, TaskListType } from "@prisma/client";
interface TaskWithIndex extends Task {
    index: number;
}
export declare class UpdateTasksIndexesDto {
    listType: TaskListType;
    tasks: TaskWithIndex[];
}
export {};
