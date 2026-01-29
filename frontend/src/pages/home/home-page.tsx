import { ListType } from "@/types";

import {
  BackgroundWrapper,
  PageLayout,
  TaskField,
  TasksList,
} from "@/components";

export const HomePage = () => {
  return (
    <>
      <PageLayout pageType={ListType.Home}>
        <TaskField listType={ListType.Home} />
        <TasksList tasks={[]} setTasks={(tasks) => console.log(tasks)} />
      </PageLayout>

      <BackgroundWrapper />
    </>
  );
};
