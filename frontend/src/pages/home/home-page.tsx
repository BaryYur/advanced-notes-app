import { useContext } from "react";

import { TaskContext } from "@/context";

import { ListType } from "@/types";

import {
  BackgroundWrapper,
  PageLayout,
  TaskField,
  TasksList,
} from "@/components";

export const HomePage = () => {
  const { tasks, setTasks } = useContext(TaskContext);

  return (
    <>
      <PageLayout pageType={ListType.Home}>
        <TaskField listType={ListType.Home} />
        <TasksList
          tasks={tasks[ListType.Home]}
          setTasks={(updatedTasks) =>
            setTasks((prevTasks) => ({
              ...prevTasks,
              [ListType.Home]: updatedTasks,
            }))
          }
        />
      </PageLayout>

      <BackgroundWrapper />
    </>
  );
};
