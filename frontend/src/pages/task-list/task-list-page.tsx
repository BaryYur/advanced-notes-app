import { useContext, useEffect, useState, useCallback } from "react";

import { useParams, useNavigate } from "react-router-dom";

import { AuthContext, TaskContext } from "@/context";

import { TaskList, ListType } from "@/types";

import { TaskListSupabaseService } from "@/services";

import { pageRoutes } from "@/config";

import { supabase } from "@/supabase";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

import {
  PageLayout,
  BackgroundWrapper,
  TaskField,
  TasksList,
} from "@/components";

export const TaskListPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { tasks } = useContext(TaskContext);

  const [taskList, setTaskList] = useState<TaskList | null>(null);

  const fetchTaskList = useCallback(async () => {
    if (params.name && user) {
      const taskListData = await TaskListSupabaseService.getTaskList({
        name: params.name,
        userId: user.id,
      });

      if (!taskListData) {
        navigate(`/${pageRoutes.app.index}/${pageRoutes.app.home}`);
        return;
      }

      setTaskList(taskListData);
    }
  }, [params.name, user, navigate]);

  useEffect(() => {
    fetchTaskList();
  }, [fetchTaskList]);

  useEffect(() => {
    if (!taskList?.id) return;

    const channel = supabase
      .channel(`task_list_id_${taskList.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "task_list",
          filter: `id=eq.${taskList.id}`,
        },
        (payload: RealtimePostgresChangesPayload<TaskList>) => {
          if (
            payload.eventType === "INSERT" ||
            payload.eventType === "UPDATE"
          ) {
            if (payload.new.name !== params.name) {
              navigate(`/${pageRoutes.app.index}/${payload.new.name}`);
            }

            setTaskList(payload.new);
          } else if (payload.eventType === "DELETE") {
            if (params.name === taskList.name) {
              navigate(`/${pageRoutes.app.index}/${pageRoutes.app.home}`);
            }
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [navigate, taskList?.id, params.name]);

  return (
    <>
      {taskList && (
        <>
          <PageLayout
            pageType={ListType.Default}
            defaultPageData={{
              id: taskList.id,
              name: taskList.name,
              color: taskList.color,
              emoji: taskList?.emoji,
            }}
          >
            <TaskField listType={ListType.Default} values={{ taskList }} />
            <TasksList
              tasks={tasks[taskList.name] ?? []}
              setTasks={(tasks) => console.log(tasks)}
            />
          </PageLayout>

          <BackgroundWrapper currentColor={taskList?.color} />
        </>
      )}
    </>
  );
};
