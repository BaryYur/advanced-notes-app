import { useState, useEffect } from "react";

import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

import { TaskListContext } from "./task-list-context";

import { TaskList } from "@/types";

import { supabase } from "@/supabase";

import { TaskListSupabaseService } from "@/services";

export const TaskListContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [taskLists, setTaskLists] = useState<TaskList[]>([]);

  const getTaskLists = async () => {
    const taskLists = await TaskListSupabaseService.getTaskLists();

    setTaskLists(taskLists || []);
  };

  const checkIsTaskListNameAvailable = (listId: string, name: string) => {
    return (
      !taskLists.some((item) => item.name === name && item.id !== listId) &&
      !["home", "today", "completed"].includes(name)
    );
  };

  useEffect(() => {
    getTaskLists();

    const channel = supabase
      .channel("task_list_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "task_list",
        },
        (payload: RealtimePostgresChangesPayload<TaskList>) => {
          if (payload.eventType === "INSERT") {
            setTaskLists((prev) => [...prev, payload.new]);
          } else if (payload.eventType === "UPDATE") {
            setTaskLists((prev) =>
              prev.map((list) =>
                list.id === payload.new.id ? payload.new : list,
              ),
            );
          } else if (payload.eventType === "DELETE") {
            setTaskLists((prev) =>
              prev.filter((list) => list.id !== payload.old.id),
            );
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <TaskListContext.Provider
      value={{ taskLists, checkIsTaskListNameAvailable }}
    >
      {children}
    </TaskListContext.Provider>
  );
};
