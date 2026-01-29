import { createContext } from "react";

import { TaskList } from "@/types";

type TaskListContextType = {
  taskLists: TaskList[];
  checkIsTaskListNameAvailable: (listId: string, name: string) => boolean;
};

export const TaskListContext = createContext({} as TaskListContextType);
