import React, { useMemo, useContext, useState } from "react";

import { AuthContext } from "@/context";

import { TaskListSupabaseService } from "@/services";

import { ListType } from "@/types";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components";
import { NavBarLinkDeleteModal } from "./nav-bar-link-delete-modal";

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
  const { user } = useContext(AuthContext);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDeleteAllTasks = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.stopPropagation();

    setIsDropdownOpen(false);

    if (user) {
      await TaskListSupabaseService.deleteAllTasks({
        userId: user.id,
        taskListId: taskList?.id,
        taskListType: navBarLinkType,
      });
    }
  };

  const handleEditTaskListName = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.stopPropagation();

    onStartEdit?.();
    setIsDropdownOpen(false);
  };

  const handleOpenDeleteModal = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.stopPropagation();

    setIsDeleteModalOpen(true);
  };

  const handleDeleteTaskList = async () => {
    if (taskList) {
      await TaskListSupabaseService.deleteTaskList(taskList.id);
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
        action: (event) => handleOpenDeleteModal(event),
        linkTypes: [ListType.Default],
      },
    ];
  }, [handleDeleteAllTasks, handleDeleteTaskList, handleEditTaskListName]);

  return (
    <>
      <div className="relative">
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <button
              className={`${isDropdownOpen ? "opacity-100" : "opacity-0"} relative z-30 rounded-lg p-1.5 hover:bg-gray-100 group-hover:opacity-100`}
            >
              <EllipsisVertical size={18} />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            side="bottom"
            className="z-50 min-w-[150px] rounded-xl border border-gray-200 bg-white p-1.5 text-sm/6 shadow-sm transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none"
          >
            <DropdownMenuGroup>
              {actions.map((action) => {
                return action.linkTypes.includes(navBarLinkType) ? (
                  <DropdownMenuItem key={action.title} className="p-0">
                    <button
                      className="flex w-full items-center justify-start gap-2 rounded-md p-1.5 hover:bg-gray-100"
                      onClick={(event) => action.action(event)}
                    >
                      {action.icon}
                      <span className="text-xs font-medium">
                        {action.title}
                      </span>
                    </button>
                  </DropdownMenuItem>
                ) : null;
              })}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <NavBarLinkDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onSubmitDeletion={handleDeleteTaskList}
      />
    </>
  );
};
