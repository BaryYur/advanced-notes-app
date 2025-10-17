import React, { useMemo } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { TaskListApiServices } from "@/services";

import { ListType } from "@/types";

import { pageRoutes } from "@/config";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

import { EllipsisVertical, Pencil, Delete, Trash2 } from "lucide-react";

interface NavBarLinkActionDropdownProps {
  taskList?: {
    id: string;
    name: string;
  };
  navBarLinkType: ListType;
  onStartEdit?: () => void;
}

export const NavBarLinkActionDropdown: React.FC<
  NavBarLinkActionDropdownProps
> = ({ taskList, navBarLinkType = ListType.Default, onStartEdit }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleDeleteAllTasks = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.stopPropagation();

    TaskListApiServices.deleteAllTasks({
      taskListId: taskList?.id,
      taskListType: navBarLinkType,
    });
  };

  const handleEditTaskListName = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.stopPropagation();

    onStartEdit?.();
  };

  const handleDeleteTaskList = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.stopPropagation();

    if (taskList) {
      const taskListName = location.pathname.split("/")[2];
      const decodedTaskListName = decodeURIComponent(taskListName);

      if (taskList.name === decodedTaskListName) {
        navigate(pageRoutes.app.home);
      }

      TaskListApiServices.deleteTaskList(taskList.id);
    }
  };

  const actions = useMemo(() => {
    return [
      {
        title: "Edit",
        icon: <Pencil size={14} />,
        action: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
          handleEditTaskListName(event),
        linkTypes: [ListType.Default],
      },
      {
        title: "Remove all tasks",
        icon: <Delete size={14} />,
        action: (event) => handleDeleteAllTasks(event),
        linkTypes: [
          ListType.Default,
          ListType.Home,
          ListType.Today,
          ListType.Completed,
        ],
      },
      {
        title: "Delete list",
        icon: <Trash2 size={14} />,
        action: (event) => handleDeleteTaskList(event),
        linkTypes: [ListType.Default],
      },
    ];
  }, []);

  return (
    <div className="relative">
      <Menu>
        <MenuButton
          type="button"
          className="rounded-lg p-1.5 opacity-0 hover:bg-gray-200/40 group-hover:opacity-100 data-[open]:opacity-100"
        >
          <EllipsisVertical size={18} />
        </MenuButton>

        <MenuItems
          transition
          anchor="bottom start"
          className="absolute z-50 mt-1.5 rounded-xl border border-gray-200 bg-white p-1 text-sm/6 transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
        >
          {actions.map((action) => {
            return action.linkTypes.includes(navBarLinkType) ? (
              <MenuItem key={action.title}>
                <button
                  className="flex w-full items-center justify-start gap-2 rounded-md px-2 py-1.5 hover:bg-gray-100"
                  onClick={(event) => action.action(event)}
                >
                  {action.icon}
                  <span className="text-xs font-medium">{action.title}</span>
                </button>
              </MenuItem>
            ) : null;
          })}
        </MenuItems>
      </Menu>
    </div>
  );
};
