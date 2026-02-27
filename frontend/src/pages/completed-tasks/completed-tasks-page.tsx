import { useContext } from "react";

import { TaskContext } from "@/context";

import { ListType } from "@/types";

import { BackgroundWrapper, PageLayout, TasksList } from "@/components";

export const CompletedTasksPage = () => {
  const { tasks, setTasks } = useContext(TaskContext);

  return (
    <>
      <PageLayout pageType={ListType.Completed}>
        <TasksList
          tasks={tasks[ListType.Completed]}
          setTasks={(tasks) => {
            setTasks((prevTasks) => ({
              ...prevTasks,
              [ListType.Completed]: tasks,
            }));
          }}
        />
      </PageLayout>

      <BackgroundWrapper />
    </>
  );
};
