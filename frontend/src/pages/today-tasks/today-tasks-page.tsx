import { ListType } from "@/types";

import { BackgroundWrapper, PageLayout } from "@/components";

export const TodayTasksPage = () => {
  return (
    <>
      <PageLayout pageType={ListType.Today}>today</PageLayout>

      <BackgroundWrapper />
    </>
  );
};
