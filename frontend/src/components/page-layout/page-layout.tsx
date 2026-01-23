import React, { useContext, useMemo } from "react";

import { AuthContext, TasksContext } from "@/context";

import { ListType } from "@/types";

import { useGetPageTitle } from "@/hooks";

import { ListIcon } from "@/components";

import { getCurrentDayPeriod } from "@/lib/utils";

import { format } from "date-fns";

import { SquareCheckBig } from "lucide-react";

interface PageLayoutProps {
  pageType: ListType;
  defaultPageData?: {
    id: string;
    name: string;
    emoji?: string;
    color: string;
  };
  children: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  pageType,
  defaultPageData,
  children,
}) => {
  const { user } = useContext(AuthContext);
  const { tasks } = useContext(TasksContext);

  const tabName = useMemo(() => {
    if (pageType !== ListType.Default) {
      return pageType.charAt(0).toUpperCase() + pageType.slice(1);
    }

    return defaultPageData?.name || "";
  }, [pageType, defaultPageData]);

  useGetPageTitle(tabName);

  const formatCurrentDate = () => {
    return format(new Date(), "EEEE MMMM dd");
  };

  const pageHeadings = {
    [ListType.Home]: (
      <>
        <h1 className="text-2xl">
          Good {getCurrentDayPeriod()} {user?.firstName},
        </h1>
        <p className="text-lg font-medium text-zinc-400/80">
          It's {formatCurrentDate()} - {tasks[ListType.Home].length} tasks
        </p>
      </>
    ),
    [ListType.Today]: <p>Today</p>,
    [ListType.Completed]: (
      <div className="relative">
        <div className="absolute inset-y-0 -left-8 top-0 flex items-center">
          <SquareCheckBig size={24} strokeWidth={2.2} />
        </div>
        <p className="text-xl">Completed</p>
      </div>
    ),
    [ListType.Default]: (
      <div className="relative">
        {defaultPageData && (
          <div className="absolute inset-y-0 -left-8 top-0 flex items-center">
            {defaultPageData.emoji ? (
              <ListIcon
                color={defaultPageData.color}
                emoji={defaultPageData.emoji}
              />
            ) : (
              <ListIcon
                className="h-5 w-5 rounded-lg border-[3px]"
                color={defaultPageData.color}
                emoji={defaultPageData?.emoji}
              />
            )}
          </div>
        )}
        <p className="text-xl">{defaultPageData?.name}</p>
      </div>
    ),
  };

  return (
    <div className="mx-auto w-full md:w-[600px]">
      <div className="fixed left-0 top-0 z-30 w-full pl-[365px] pt-20 backdrop-blur-sm">
        <div className="mx-auto pb-4 md:w-[600px]">
          {pageHeadings[pageType]}
        </div>
      </div>

      <div className={`${pageType === ListType.Home && "pt-40"} pt-32`}>
        {children}
      </div>
    </div>
  );
};
