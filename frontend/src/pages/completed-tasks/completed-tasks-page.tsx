import { useContext } from "react";

import { TasksContext } from "@/context";

import { ListType } from "@/types";

import { BackgroundWrapper, PageLayout, TasksList } from "@/components";

export const CompletedTasksPage = () => {
  const { tasks, handleFetchTasks } = useContext(TasksContext);

  return (
    <>
      <PageLayout pageType={ListType.Completed}>
        <TasksList
          tasks={tasks[ListType.Completed]}
          setTasks={(tasks) => handleFetchTasks(ListType.Completed, tasks)}
        />
      </PageLayout>

      <BackgroundWrapper />
    </>
  );
};
