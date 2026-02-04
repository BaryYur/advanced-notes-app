import { AppTasks } from "@/context";

import { ListType, Task, TaskList } from "@/types";

import { supabase } from "@/supabase";

import { handleApiError } from "@/errors";

import { isToday, format, parseISO } from "date-fns";

const getAllTasks = async (userId: string): Promise<AppTasks | null> => {
  const { data: allTasks, error: tasksError } = await supabase
    .from("task")
    .select(`*, taskList:task_list(*)`)
    .eq("userId", userId)
    .returns<Task[]>();

  const { data: taskLists, error: taskListsError } = await supabase
    .from("task_list")
    .select("*")
    .eq("userId", userId)
    .returns<TaskList[]>();

  if (tasksError || taskListsError) {
    handleApiError(tasksError || taskListsError);
    return null;
  }

  const tasks = allTasks.map((task) => ({
    ...task,
    date: task.date ? parseISO(task.date as unknown as string) : null,
    createdAt: parseISO(task.createdAt as unknown as string),
  })) as Task[];

  const homeTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  const todayTasks = tasks.filter(
    (t) => t.date && isToday(t.date) && !t.completed,
  );

  const tasksByList: AppTasks = {
    [ListType.Home]: homeTasks,
    [ListType.Today]: todayTasks,
    [ListType.Completed]: completedTasks,
  };

  taskLists.forEach((taskList) => {
    tasksByList[taskList.name] = tasks.filter(
      (task) => task.taskListId === taskList.id && !task.completed,
    );
  });

  // !TODO need to sort list tasks by their indexes
  // sort by their indexes for every list
  // const sortedHomeTasks = homeTasks.sort((a, b) => a.homeIndex - b.homeIndex);
  // const sortedTodayTasks = todayTasks.sort(
  //   (a, b) => a.todayIndex - b.todayIndex,
  // );
  // const sortedCompletedTasks = completedTasks.sort(
  //   (a, b) => a.completedIndex - b.completedIndex,
  // );

  return tasksByList;
};

interface CreateTaskData {
  userId: string;
  title: string;
  taskListId?: string;
  date?: Date;
}

const createTask = async (task: CreateTaskData): Promise<Task | null> => {
  const { data, error } = await supabase
    .from("task")
    .insert({
      ...task,
      date: task.date ? format(task.date, "yyyy-MM-dd") : undefined,
    })
    .select()
    .single();

  // !TODO handle task index for different lists

  if (error) {
    handleApiError(error);
  }

  return data;
};

interface UpdateTaskData {
  title?: string;
  taskListId?: string;
  date?: Date;
  completed?: boolean;
  note?: string;
  defaultIndex?: number;
  homeIndex?: number;
  completedIndex?: number;
}

const updateTask = async (
  id: string,
  task: UpdateTaskData,
): Promise<Task | null> => {
  const { data, error } = await supabase
    .from("task")
    .update({
      ...task,
      date:
        task.date === null
          ? null
          : task.date
            ? format(task.date, "yyyy-MM-dd")
            : undefined,
    })
    .eq("id", id);

  if (error) {
    handleApiError(error);
  }

  return data;
};

const deleteTask = async (id: string): Promise<void> => {
  const { error } = await supabase.from("task").delete().eq("id", id);

  if (error) {
    handleApiError(error);
  }
};

export const TaskSupabaseService = {
  createTask,
  updateTask,
  getAllTasks,
  deleteTask,
};
