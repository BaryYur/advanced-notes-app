import React, { createContext, useContext, useEffect, useState } from "react";

import { AuthContext } from "./auth-context";

import { ListType, Task } from "@/types";

import { socket } from "@/vars";

interface TasksType {
  [ListType.Home]: Task[];
  [ListType.Completed]: Task[];
}

interface TasksContextType {
  tasks: TasksType;
  handleFetchTasks: (listType: ListType, tasks: Task[]) => void;
}

export const TasksContext = createContext({} as TasksContextType);

export const TasksContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = useContext(AuthContext);

  const [tasks, setTasks] = useState<TasksType>({
    [ListType.Home]: [],
    [ListType.Completed]: [],
  });

  const handleFetchTasks = (listType: ListType, data: Task[]) => {
    setTasks((prevState) => ({
      ...prevState,
      [listType]: data,
    }));
  };

  useEffect(() => {
    if (user) {
      socket.emit("getHomeTasks", user.id);
      socket.emit("getCompletedTasks", user.id);

      socket.on("userHomeTasks", (data: Task[]) =>
        handleFetchTasks(ListType.Home, data),
      );
      socket.on("userCompletedTasks", (data: Task[]) =>
        handleFetchTasks(ListType.Completed, data),
      );

      return () => {
        socket.off("userHomeTasks", (data: Task[]) =>
          handleFetchTasks(ListType.Home, data),
        );
        socket.off("userCompletedTasks", (data: Task[]) =>
          handleFetchTasks(ListType.Completed, data),
        );
      };
    }
  }, [user]);

  return (
    <TasksContext.Provider
      value={{
        tasks,
        handleFetchTasks,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};
