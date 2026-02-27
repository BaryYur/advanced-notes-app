import { useContext } from "react";

import { TaskContext } from "@/context";

import { ListType } from "@/types";

import {
  BackgroundWrapper,
  PageLayout,
  TasksList,
  TaskField,
} from "@/components";

export const TodayTasksPage = () => {
  const { tasks, setTasks } = useContext(TaskContext);

  return (
    <>
      <PageLayout pageType={ListType.Today}>
        <TaskField listType={ListType.Today} values={{ date: new Date() }} />
        <TasksList
          tasks={tasks[ListType.Today] ?? []}
          setTasks={(tasks) => {
            setTasks((prevTasks) => ({
              ...prevTasks,
              [ListType.Today]: tasks,
            }));
          }}
        />
      </PageLayout>

      <BackgroundWrapper />
    </>
  );
};
