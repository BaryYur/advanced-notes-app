import { ListType } from "@/types";

import { socket } from "@/lib";

interface CreateTaskData {
  userId: string;
  taskListId: string | null;
  title: string;
  date: Date | undefined;
}

const createTask = (data: { taskListType: ListType; task: CreateTaskData }) => {
  socket.emit("createTask", data);
};

interface UpdateTaskData {
  title?: string;
  note?: string;
  completed?: boolean;
  date?: Date | undefined;
}

const updateTask = (data: { id: string; task: UpdateTaskData }) => {
  socket.emit("updateTask", data);
};

const deleteTask = (data: { id: string }) => {
  socket.emit("removeTask", data);
};

// const getCompleted

export const TaskApiService = {
  createTask,
  updateTask,
  deleteTask,
};
