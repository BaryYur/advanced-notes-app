import { useContext } from "react";

import { TaskContext } from "@/context";

import { ListType } from "@/types";

import { useGetTaskList } from "@/hooks";

import {
  PageLayout,
  BackgroundWrapper,
  TaskField,
  TasksList,
} from "@/components";

export const TaskListPage = () => {
  const { setTasks } = useContext(TaskContext);
  const { taskList, tasks } = useGetTaskList();

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
              listId={taskList.id}
              tasks={tasks ?? []}
              setTasks={(updatedTasks) => {
                setTasks((prevTasks) => ({
                  ...prevTasks,
                  [taskList.name]: updatedTasks,
                }));
              }}
            />
          </PageLayout>

          <BackgroundWrapper currentColor={taskList?.color} />
        </>
      )}
    </>
  );
};
