import { apiClient } from "@/vars";

import { TaskList, ListType } from "@/types";

import { socket } from "@/vars";

import { handleApiError } from "@/errors";

export interface CreateTaskListData {
  name: string;
  userId: string;
  color: string;
  emoji?: string;
}

const createTaskList = (data: CreateTaskListData) => {
  socket.emit("createTaskList", data);
};

const getTaskList = async (userId: string, name: string) => {
  try {
    const response = await apiClient.get(`/task-list/${userId}/${name}`);

    return response.data as TaskList;
  } catch (error) {
    handleApiError(error);
  }
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
  getTaskList,
  createTaskList,
  updateTaskList,
  deleteTaskList,
  deleteAllTasks,
};
