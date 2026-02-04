import React, { useContext, useEffect, useState } from "react";

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

  const [tasks, setTasks] = useState<AppTasks>({
    [ListType.Home]: [],
    [ListType.Today]: [],
    [ListType.Completed]: [],
  });

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
        () => {
          getAllTasks();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return (
    <TaskContext.Provider value={{ tasks }}>{children}</TaskContext.Provider>
  );
};
