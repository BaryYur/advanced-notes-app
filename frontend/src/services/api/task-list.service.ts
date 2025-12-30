import { socket } from "@/lib";

import { ListType } from "@/types";

export interface CreateTaskListData {
  name: string;
  userId: string;
  color: string;
  emoji?: string;
}

const createTaskList = (data: CreateTaskListData) => {
  socket.emit("createTaskList", data);
};

export interface UpdateTaskListData {
  name?: string;
  emoji?: string;
  color?: string;
}

const updateTaskList = (id: string, data: UpdateTaskListData) => {
  socket.emit("updateTaskList", { taskListId: id, data });
};

const deleteTaskList = (id: string) => {
  socket.emit("deleteTaskList", id);
};

const deleteAllTasks = (data: {
  taskListId?: string;
  taskListType: ListType;
}) => {
  socket.emit("deleteAllListTasks", data);
};

export const TaskListApiServices = {
  createTaskList,
  updateTaskList,
  deleteTaskList,
  deleteAllTasks,
};
