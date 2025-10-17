export const enum ListType {
  Home = "home",
  Today = "today",
  Completed = "completed",
  Default = "default",
}

export interface TaskList {
  id: string;
  name: string;
  userId: string;
  color: string;
  emoji?: string;
  tasksCounter: number;
}
