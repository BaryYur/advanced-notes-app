import { TaskList, ListType } from "@/types";

import { supabase } from "@/supabase";

import { handleApiError } from "@/errors";

const getTaskLists = async (): Promise<TaskList[] | undefined> => {
  const { data, error } = await supabase
    .from("task_list")
    .select("*")
    .returns<TaskList[]>();

  if (error) {
    handleApiError(error);
    return;
  }

  return data;
};

const getTaskList = async ({
  name,
  userId,
}: {
  name: string;
  userId: string;
}): Promise<TaskList | undefined> => {
  const { data } = await supabase
    .from("task_list")
    .select("*")
    .eq("name", name)
    .eq("userId", userId)
    .single();

  return data;
};

export interface CreateTaskListData {
  name: string;
  userId: string;
  color: string;
  emoji?: string;
}

const createTaskList = async (
  data: CreateTaskListData,
): Promise<TaskList | undefined> => {
  const { data: newList, error } = await supabase
    .from("task_list")
    .insert(data)
    .select()
    .single();

  if (error) {
    handleApiError(error);
    return;
  }

  return newList;
};

export interface UpdateTaskListData {
  name?: string;
  emoji?: string;
  color?: string;
}

const updateTaskList = async (
  id: string,
  data: UpdateTaskListData,
): Promise<TaskList | undefined> => {
  const { data: updatedTaskList, error } = await supabase
    .from("task_list")
    .update(data)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    handleApiError(error);
    return;
  }

  return updatedTaskList;
};

const deleteTaskList = async (id: string): Promise<void> => {
  const { error } = await supabase.from("task_list").delete().eq("id", id);

  if (error) {
    handleApiError(error);
    return;
  }
};

const deleteAllTasks = async ({
  taskListId,
  taskListType,
}: {
  taskListId?: string;
  taskListType: ListType;
}): Promise<void> => {
  switch (taskListType) {
    case ListType.Home: {
      const { error } = await supabase.from("task").delete();

      if (error) {
        handleApiError(error);
        return;
      }

      break;
    }

    case ListType.Today: {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const { error } = await supabase
        .from("task")
        .delete()
        .gte("createdAt", startOfDay.toISOString());

      if (error) {
        handleApiError(error);
        return;
      }

      break;
    }

    case ListType.Completed: {
      const { error } = await supabase
        .from("task")
        .delete()
        .eq("completed", true);

      if (error) {
        handleApiError(error);
        return;
      }

      break;
    }

    case ListType.Default: {
      if (taskListId) {
        const { error } = await supabase
          .from("task")
          .delete()
          .eq("taskListId", taskListId);

        if (error) {
          handleApiError(error);
          return;
        }
      }

      break;
    }
  }
};

export const TaskListSupabaseService = {
  getTaskLists,
  getTaskList,
  createTaskList,
  updateTaskList,
  deleteTaskList,
  deleteAllTasks,
};
