import { useContext } from "react";

import { TasksContext } from "@/context";

import { ListType } from "@/types";

import {
  BackgroundWrapper,
  PageLayout,
  TaskField,
  TasksList,
} from "@/components";

export const HomePage = () => {
  const { tasks, handleFetchTasks } = useContext(TasksContext);

  return (
    <>
      <PageLayout pageType={ListType.Home}>
        <TaskField listType={ListType.Home} />
        <TasksList
          tasks={tasks[ListType.Home]}
          setTasks={(tasks) => handleFetchTasks(ListType.Home, tasks)}
        />
      </PageLayout>

      <BackgroundWrapper />
    </>
  );
};
