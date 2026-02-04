import { useContext } from "react";

import { AuthContext, TaskListContext, TaskContext } from "@/context";

import { ListType } from "@/types";

import { Skeleton } from "@/components";
import { NavBarLink } from "./nav-bar-link";
import { NavBarTaskListField } from "./nav-bar-task-list-field";
import { NavBarUserDropdown } from "./nav-bar-user-dropdown";

export const NavBar = () => {
  const { isUserPending } = useContext(AuthContext);
  const { taskLists } = useContext(TaskListContext);
  const { tasks } = useContext(TaskContext);

  return (
    <div className="fixed bottom-2.5 left-2.5 top-2.5 z-40 flex h-[calc(100%-20px)] w-[calc(100%-20px)] flex-col justify-between rounded-3xl bg-white p-9 shadow transition-all sm:w-[345px]">
      {isUserPending ? (
        <>
          <div className="flex flex-col gap-2">
            {[1, 2, 3, 4, 5, 6].map((_item, index) => (
              <Skeleton key={index} className="h-10 w-full rounded-xl" />
            ))}
          </div>

          <Skeleton className="h-10 w-full rounded-xl" />
        </>
      ) : (
        <>
          <div>
            <ul>
              <NavBarLink
                taskListId=""
                title="home"
                linkType={ListType.Home}
                color=""
                tasksCounter={tasks[ListType.Home]?.length ?? 0}
              />
              <NavBarLink
                taskListId=""
                title="today"
                linkType={ListType.Today}
                color=""
                tasksCounter={tasks[ListType.Today]?.length ?? 0}
              />
              <NavBarLink
                taskListId=""
                title="completed"
                linkType={ListType.Completed}
                color=""
                tasksCounter={tasks[ListType.Completed]?.length ?? 0}
              />

              {taskLists.map((taskList) => (
                <NavBarLink
                  key={taskList.id}
                  taskListId={taskList.id}
                  title={taskList.name}
                  linkType={ListType.Default}
                  color={taskList.color}
                  emoji={taskList?.emoji}
                  tasksCounter={tasks[taskList.name]?.length ?? 0}
                />
              ))}
            </ul>

            <NavBarTaskListField action="create" />
          </div>

          <NavBarUserDropdown />
        </>
      )}
    </div>
  );
};
