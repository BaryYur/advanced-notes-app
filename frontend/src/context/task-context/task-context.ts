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
  setTasks: React.Dispatch<React.SetStateAction<AppTasks>>;
  getAllTasks: () => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  setIgnoreRealtime: () => void;
};

export const TaskContext = createContext({} as TaskContextType);
