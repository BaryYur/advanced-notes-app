import React, { useMemo } from "react";

import { TaskSupabaseService } from "@/services";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components";

import { Edit2, Trash2, Copy, EllipsisVertical } from "lucide-react";

interface TaskListItemDropdownProps {
  taskId: string;
  toggleOpen: () => void;
  isOpen: boolean;
}

export const TaskListItemDropdown: React.FC<TaskListItemDropdownProps> = ({
  taskId,
  toggleOpen,
  isOpen,
}) => {
  const handleEditTask = () => {};

  const handleDuplicateTask = () => {};

  const handleDeleteTask = async () => {
    await TaskSupabaseService.deleteTask(taskId);
  };

  const actions = useMemo(() => {
    return [
      {
        id: 1,
        title: "Edit",
        icon: <Edit2 size={14} />,
        action: handleEditTask,
      },
      {
        id: 2,
        title: "Duplicate",
        icon: <Copy size={14} />,
        action: handleDuplicateTask,
      },
      {
        id: 3,
        title: "Delete",
        icon: <Trash2 size={14} />,
        action: handleDeleteTask,
      },
    ] as const;
  }, []);

  return (
    <DropdownMenu open={isOpen} onOpenChange={() => toggleOpen()}>
      <DropdownMenuTrigger asChild>
        <button
          className={`${isOpen ? "opacity-100" : "opacity-0"} relative z-30 rounded-lg p-1.5 hover:bg-gray-100 group-hover:opacity-100`}
        >
          <EllipsisVertical size={18} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        side="bottom"
        className="z-50 min-w-[150px] rounded-xl border border-gray-200 bg-white p-1.5 text-sm/6 shadow-sm transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none"
      >
        <DropdownMenuGroup>
          {actions.map((action) => (
            <DropdownMenuItem key={action.id} className="p-0">
              <button
                className="flex w-full items-center justify-start gap-2 rounded-md p-1.5 hover:bg-gray-100"
                onClick={() => action.action()}
              >
                {action.icon}
                <span className="text-xs font-medium">{action.title}</span>
              </button>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
