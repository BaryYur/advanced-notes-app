import React, { useContext, useEffect, useRef, useState } from "react";

import { TaskSupabaseService } from "@/services";

import { ListType } from "@/types";

import { supabase } from "@/supabase";

import { TaskContext, AppTasks } from "./task-context";
import { AuthContext } from "../auth-context";

export const TaskContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = useContext(AuthContext);

  const lastDraggingUpdate = useRef<number>(0);

  const [tasks, setTasks] = useState<AppTasks>({
    [ListType.Home]: [],
    [ListType.Today]: [],
    [ListType.Completed]: [],
  });

  const setIgnoreRealtime = () => {
    lastDraggingUpdate.current = Date.now();
  };

  const getAllTasks = async () => {
    if (user) {
      const tasks: AppTasks | null = await TaskSupabaseService.getAllTasks(
        user.id,
      );

      if (tasks) {
        setTasks(tasks);
      }
    }
  };

  const deleteTask = async (taskId: string) => {
    setTasks((prev) => {
      const newTasks = { ...prev };

      Object.keys(newTasks).forEach((key) => {
        newTasks[key] = newTasks[key].filter((task) => task.id !== taskId);
      });

      return newTasks;
    });

    await TaskSupabaseService.deleteTask(taskId);
  };

  useEffect(() => {
    if (!user) return;

    getAllTasks();

    const channel = supabase
      .channel("task_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "task",
          filter: `userId=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType !== "UPDATE") {
            getAllTasks();
            return;
          }

          const now = Date.now();
          const secondsSinceLastDrag =
            (now - lastDraggingUpdate.current) / 1000;

          if (secondsSinceLastDrag < 2.5) {
            return;
          }

          getAllTasks();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return (
    <TaskContext.Provider
      value={{ tasks, setTasks, getAllTasks, deleteTask, setIgnoreRealtime }}
    >
      {children}
    </TaskContext.Provider>
  );
};
