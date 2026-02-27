import { AppTasks } from "@/context";

import { ListType, Task, TaskList } from "@/types";

import { supabase } from "@/supabase";

import { handleApiError } from "@/errors";

import { isToday, format, parseISO } from "date-fns";

const getAllTasks = async (userId: string): Promise<AppTasks | null> => {
  const { data: allTasks, error: tasksError } = await supabase
    .from("task")
    .select(`*, taskList:task_list(*), taskOrder:task_order(*)`)
    .eq("userId", userId)
    .order("createdAt", { ascending: false })
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

  const sortByOrder = (context: string) => (a: Task, b: Task) => {
    const orderA = a.taskOrder?.find((o) => o.context === context);
    const orderB = b.taskOrder?.find((o) => o.context === context);

    const posA = orderA?.position;
    const posB = orderB?.position;

    if (posA !== undefined && posB !== undefined) {
      return posA - posB;
    }

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  };

  const tasksByList: AppTasks = {
    [ListType.Home]: homeTasks.sort(sortByOrder(ListType.Home)),
    [ListType.Today]: todayTasks.sort(sortByOrder(ListType.Today)),
    [ListType.Completed]: completedTasks.sort(sortByOrder(ListType.Completed)),
  };

  taskLists.forEach((taskList) => {
    tasksByList[taskList.name] = tasks
      .filter((task) => task.taskListId === taskList.id && !task.completed)
      .sort(sortByOrder(taskList.id));
  });

  return tasksByList;
};

interface CreateTaskData {
  userId: string;
  title: string;
  taskListId?: string;
  date?: Date;
}

const getMinPosition = async (
  userId: string,
  context: string,
): Promise<number> => {
  const { data } = await supabase
    .from("task_order")
    .select("position")
    .eq("userId", userId)
    .eq("context", context)
    .order("position", { ascending: true })
    .limit(1)
    .maybeSingle();

  return data ? (data.position as number) - 1 : 0;
};

const createTask = async (task: CreateTaskData): Promise<Task | null> => {
  const { data, error: createTaskError } = await supabase
    .from("task")
    .insert({
      ...task,
      date: task.date ? format(task.date, "yyyy-MM-dd") : undefined,
    })
    .select()
    .single();

  if (createTaskError) {
    handleApiError(createTaskError);

    return null;
  }

  const ordersToInsert = [];

  const homePosition = await getMinPosition(task.userId, ListType.Home);

  ordersToInsert.push({
    taskId: data.id,
    userId: task.userId,
    context: ListType.Home,
    position: homePosition,
  });

  if (task.date && isToday(task.date)) {
    const todayPosition = await getMinPosition(task.userId, ListType.Today);

    ordersToInsert.push({
      taskId: data.id,
      userId: task.userId,
      context: ListType.Today,
      position: todayPosition,
    });
  }

  if (task.taskListId) {
    const listPosition = await getMinPosition(task.userId, task.taskListId);

    ordersToInsert.push({
      taskId: data.id,
      userId: task.userId,
      context: task.taskListId,
      position: listPosition,
    });
  }

  if (ordersToInsert.length > 0) {
    const { error: ordersError } = await supabase
      .from("task_order")
      .insert(ordersToInsert);

    if (ordersError) {
      handleApiError(ordersError);
    }
  }

  return {
    ...data,
    taskOrder: ordersToInsert.map((o) => ({
      context: o.context,
      position: o.position,
    })),
  };
};

interface UpdateTaskData {
  title?: string;
  taskListId?: string | null;
  date?: Date | null;
  completed?: boolean;
  note?: string;
}

const updateTask = async (
  id: string,
  userId: string,
  task: UpdateTaskData,
  taskOldDate?: Date | null,
): Promise<Task | null> => {
  const { data: taskData, error: taskError } = await supabase
    .from("task")
    .select()
    .eq("id", id)
    .single();

  if (taskError) {
    handleApiError(taskError);
    return null;
  }

  const { data: updatedTaskData, error: updateTaskError } = await supabase
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

  const deleteOldTaskOrder = async () => {
    return await supabase
      .from("task_order")
      .delete()
      .eq("taskId", id)
      .eq("context", taskData.taskListId);
  };

  if (task.taskListId) {
    const newPosition = await getMinPosition(userId, task.taskListId);

    const { error: deleteOldOrderError } = await deleteOldTaskOrder();
    const { error: createNewOrderError } = await supabase
      .from("task_order")
      .insert({
        taskId: id,
        userId,
        context: task.taskListId,
        position: newPosition,
      });

    if (deleteOldOrderError || createNewOrderError) {
      handleApiError(deleteOldOrderError || createNewOrderError);
    }
  }

  if (task.taskListId === null) {
    const { error: deleteOldOrderError } = await deleteOldTaskOrder();

    if (deleteOldOrderError) {
      handleApiError(deleteOldOrderError);
    }
  }

  if (task.completed === true) {
    // 1. remove home context
    const { error: deleteTaskHomeContextError } = await supabase
      .from("task_order")
      .delete()
      .eq("taskId", id)
      .eq("context", ListType.Home);

    if (deleteTaskHomeContextError) {
      handleApiError(deleteTaskHomeContextError);
    }

    if (taskData.taskListId) {
      // 2. remove own context
      const { error: deleteOldOrderError } = await deleteOldTaskOrder();

      if (deleteOldOrderError) {
        handleApiError(deleteOldOrderError);
      }
    }

    if (taskData.date && isToday(taskData.date)) {
      // 3. remove today context
      const { error: deleteTodayContextError } = await supabase
        .from("task_order")
        .delete()
        .eq("taskId", id)
        .eq("context", ListType.Today);

      if (deleteTodayContextError) {
        handleApiError(deleteTodayContextError);
      }
    }

    // 4. add completed context
    const newPosition = await getMinPosition(userId, ListType.Completed);
    const { error: createCompletedContextError } = await supabase
      .from("task_order")
      .insert({
        taskId: id,
        userId,
        context: ListType.Completed,
        position: newPosition,
      });

    if (createCompletedContextError) {
      handleApiError(createCompletedContextError);
    }
  } else if (task.completed === false) {
    // 1. remove completed context
    const { error: deleteCompletedContextError } = await supabase
      .from("task_order")
      .delete()
      .eq("taskId", id)
      .eq("context", ListType.Completed);

    if (deleteCompletedContextError) {
      handleApiError(deleteCompletedContextError);
    }

    if (taskData.taskListId) {
      // 2. create own context
      const newPosition = await getMinPosition(userId, taskData.taskListId);
      const { error: createOwnContextError } = await supabase
        .from("task_order")
        .insert({
          taskId: id,
          userId,
          context: taskData.taskListId,
          position: newPosition,
        });

      if (createOwnContextError) {
        handleApiError(createOwnContextError);
      }
    }

    if (taskData.date && isToday(taskData.date)) {
      // 3. create today context
      const newPosition = await getMinPosition(userId, ListType.Today);
      const { error: createTodayContextError } = await supabase
        .from("task_order")
        .insert({
          taskId: id,
          userId,
          context: ListType.Today,
          position: newPosition,
        });

      if (createTodayContextError) {
        handleApiError(createTodayContextError);
      }
    }

    // 4. create home context
    const newPosition = await getMinPosition(userId, ListType.Home);
    const { error: createHomeContextError } = await supabase
      .from("task_order")
      .insert({
        taskId: id,
        userId,
        context: ListType.Home,
        position: newPosition,
      });

    if (createHomeContextError) {
      handleApiError(createHomeContextError);
    }
  }

  if (task.date && isToday(task.date)) {
    const newPosition = await getMinPosition(userId, ListType.Today);
    const { error: createTodayContextError } = await supabase
      .from("task_order")
      .insert({
        taskId: id,
        userId,
        context: ListType.Today,
        position: newPosition,
      });

    if (createTodayContextError) {
      handleApiError(createTodayContextError);
    }
  }

  if (
    (task.date === null || task.date) &&
    taskOldDate &&
    isToday(taskOldDate)
  ) {
    const { error: deleteTodayContextError } = await supabase
      .from("task_order")
      .delete()
      .eq("taskId", id)
      .eq("context", ListType.Today);

    if (deleteTodayContextError) {
      handleApiError(deleteTodayContextError);
    }
  }

  if (updateTaskError) {
    handleApiError(updateTaskError);
  }

  return updatedTaskData;
};

interface DuplicateTaskData {
  userId: string;
  title: string;
  taskListId?: string;
  date?: Date;
  completed: boolean;
  note: string;
}

const duplicateTask = async (taskData: DuplicateTaskData) => {
  const { data: duplicateData, error: duplicateError } = await supabase
    .from("task")
    .insert({
      ...taskData,
      date: taskData.date ? format(taskData.date, "yyyy-MM-dd") : undefined,
    })
    .select()
    .single();

  if (duplicateError) {
    handleApiError(duplicateError);
  }

  if (!taskData.completed) {
    const newPosition = await getMinPosition(taskData.userId, ListType.Home);
    const { error: createTodayContextOrderError } = await supabase
      .from("task_order")
      .insert({
        taskId: duplicateData.id,
        userId: taskData.userId,
        context: ListType.Home,
        position: newPosition,
      });

    if (createTodayContextOrderError) {
      handleApiError(createTodayContextOrderError);
    }

    if (taskData.taskListId) {
      const newPosition = await getMinPosition(
        taskData.userId,
        taskData.taskListId,
      );
      const { error: createListContextOrderError } = await supabase
        .from("task_order")
        .insert({
          taskId: duplicateData.id,
          userId: taskData.userId,
          context: taskData.taskListId,
          position: newPosition,
        });

      if (createListContextOrderError) {
        handleApiError(createListContextOrderError);
      }
    }

    if (taskData.date && isToday(taskData.date)) {
      const newPosition = await getMinPosition(taskData.userId, ListType.Today);
      const { error: createTodayContextOrderError } = await supabase
        .from("task_order")
        .insert({
          taskId: duplicateData.id,
          userId: taskData.userId,
          context: ListType.Today,
          position: newPosition,
        });

      if (createTodayContextOrderError) {
        handleApiError(createTodayContextOrderError);
      }
    }
  } else {
    const newPosition = await getMinPosition(
      taskData.userId,
      ListType.Completed,
    );
    const { error: createCompletedContextOrderError } = await supabase
      .from("task_order")
      .insert({
        taskId: duplicateData.id,
        userId: taskData.userId,
        context: ListType.Completed,
        position: newPosition,
      });

    if (createCompletedContextOrderError) {
      handleApiError(createCompletedContextOrderError);
    }
  }

  return duplicateData;
};

const deleteTask = async (id: string): Promise<void> => {
  const { error } = await supabase.from("task").delete().eq("id", id);

  if (error) {
    handleApiError(error);
  }
};

const updateTaskOrder = async (orderData: {
  taskId: string;
  listContext: ListType | string;
  newIndex: number;
}) => {
  const { data, error } = await supabase
    .from("task_order")
    .update({
      position: orderData.newIndex,
    })
    .eq("taskId", orderData.taskId)
    .eq("context", orderData.listContext);

  if (error) {
    handleApiError(error);
  }

  return data;
};

export const TaskSupabaseService = {
  createTask,
  updateTask,
  getAllTasks,
  duplicateTask,
  deleteTask,
  updateTaskOrder,
};
