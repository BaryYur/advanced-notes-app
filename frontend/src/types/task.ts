import { TaskList } from "@/types";

export interface Task {
  id: string;
  title: string;
  taskListId?: string;
  completed: boolean;
  note: string;
  date: Date;
  createdAt: Date;
  taskList: TaskList;
  taskOrder: {
    context: string;
    position: number;
  }[];
}
