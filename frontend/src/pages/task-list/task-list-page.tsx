import { ListType } from "@/types";

import { useGetTaskList } from "@/hooks";

import {
  PageLayout,
  BackgroundWrapper,
  TaskField,
  TasksList,
} from "@/components";

export const TaskListPage = () => {
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
              tasks={tasks ?? []}
              setTasks={(tasks) => console.log(tasks)}
            />
          </PageLayout>

          <BackgroundWrapper currentColor={taskList?.color} />
        </>
      )}
    </>
  );
};
