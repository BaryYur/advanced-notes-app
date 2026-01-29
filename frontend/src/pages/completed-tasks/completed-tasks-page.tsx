import { ListType } from "@/types";

import { BackgroundWrapper, PageLayout, TasksList } from "@/components";

export const CompletedTasksPage = () => {
  return (
    <>
      <PageLayout pageType={ListType.Completed}>
        <TasksList tasks={[]} setTasks={(tasks) => console.log(tasks)} />
      </PageLayout>

      <BackgroundWrapper />
    </>
  );
};
