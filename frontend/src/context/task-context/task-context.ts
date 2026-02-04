import { createContext } from "react";

import { ListType, Task } from "@/types";

export interface AppTasks {
  [ListType.Home]: Task[];
  [ListType.Today]: Task[];
  [ListType.Completed]: Task[];
  [key: string]: Task[];
}

type TaskContextType = {
  tasks: AppTasks;
};

export const TaskContext = createContext({} as TaskContextType);
