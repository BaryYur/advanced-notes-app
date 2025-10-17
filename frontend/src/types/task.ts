import { TaskList } from "@/types";

export interface Task {
  id: string;
  title: string;
  taskListId?: string;
  completed: boolean;
  note: string;
  defaultIndex: number | null;
  homeIndex: number;
  completedIndex: number | null;
  date: Date;
  createdAt: Date;
  taskList: TaskList;
}
