import { useState, useEffect, useContext } from "react";

import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

import { TaskListContext } from "./task-list-context";
import { AuthContext } from "@/context";

import { TaskList } from "@/types";

import { supabase } from "@/supabase";

import { TaskListSupabaseService } from "@/services";

export const TaskListContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = useContext(AuthContext);

  const [taskLists, setTaskLists] = useState<TaskList[]>([]);

  const getTaskLists = async () => {
    if (user) {
      const taskLists: TaskList[] | undefined =
        await TaskListSupabaseService.getTaskLists(user.id);

      if (taskLists) setTaskLists(taskLists);
    }
  };

  const checkIsTaskListNameAvailable = (listId: string, name: string) => {
    return (
      !taskLists.some((item) => item.name === name && item.id !== listId) &&
      !["home", "today", "completed"].includes(name)
    );
  };

  useEffect(() => {
    if (!user) return;

    getTaskLists();

    const channel = supabase
      .channel("task_list_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "task_list",
          filter: `userId=eq.${user.id}`,
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
  }, [user]);

  return (
    <TaskListContext.Provider
      value={{ taskLists, checkIsTaskListNameAvailable }}
    >
      {children}
    </TaskListContext.Provider>
  );
};
