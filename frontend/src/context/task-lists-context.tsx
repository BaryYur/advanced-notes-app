import React, { createContext, useContext, useEffect, useState } from "react";

import { AuthContext, TasksContextProvider } from "@/context";

import { TaskList } from "@/types";

import { socket } from "@/lib";

interface TaskListsContextType {
  taskLists: TaskList[];
  checkIsTaskListNameAvailable: (listId: string, name: string) => boolean;
  handleTaskLists: (data: TaskList[]) => void;
  handleTaskListCreated: (newTaskList: TaskList) => void;
  handleTaskListUpdated: (updatedTaskList: TaskList) => void;
  handleTaskListDeleted: (id: string) => void;
}

export const TaskListsContext = createContext({} as TaskListsContextType);

export const TaskListsContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = useContext(AuthContext);

  const [taskLists, setTaskLists] = useState<TaskList[]>([]);

  const checkIsTaskListNameAvailable = (listId: string, name: string) => {
    return (
      !taskLists.some((item) => item.name === name && item.id !== listId) &&
      !["home", "today", "completed"].includes(name)
    );
  };

  const handleTaskLists = (data: TaskList[]) => {
    setTaskLists(data);
  };

  const handleTaskListCreated = (newTaskList: TaskList) => {
    setTaskLists((prevLists) => [...prevLists, newTaskList]);
  };

  const handleTaskListUpdated = (updatedTaskList: TaskList) => {
    setTaskLists((prevLists) =>
      prevLists.map((taskList) =>
        taskList.id === updatedTaskList.id ? updatedTaskList : taskList,
      ),
    );
  };

  const handleTaskListDeleted = (id: string) => {
    setTaskLists((prevLists) =>
      prevLists.filter((taskList) => taskList.id !== id),
    );
  };

  useEffect(() => {
    if (user) {
      socket.emit("getTaskListsByUserId", user.id);
      socket.emit("getHomeTasks", user.id);

      socket.on("taskListsByUserId", handleTaskLists);
      socket.on("taskListCreated", handleTaskListCreated);
      socket.on("taskListUpdated", handleTaskListUpdated);
      socket.on("taskListDeleted", handleTaskListDeleted);

      return () => {
        socket.off("taskListsByUserId", handleTaskLists);
        socket.off("taskListCreated", handleTaskListCreated);
        socket.off("taskListUpdated", handleTaskListUpdated);
        socket.off("taskListDeleted", handleTaskListDeleted);
      };
    }
  }, [user]);

  return (
    <TaskListsContext.Provider
      value={{
        taskLists,
        checkIsTaskListNameAvailable,
        handleTaskLists,
        handleTaskListCreated,
        handleTaskListUpdated,
        handleTaskListDeleted,
      }}
    >
      <TasksContextProvider>{children}</TasksContextProvider>
    </TaskListsContext.Provider>
  );
};
