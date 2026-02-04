import React, { useMemo } from "react";

import { TaskSupabaseService } from "@/services";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

import { Edit2, Trash2, Copy, EllipsisVertical } from "lucide-react";

interface TaskListItemDropdownProps {
  taskId: string;
  toggleOpen: () => void;
}

export const TaskListItemDropdown: React.FC<TaskListItemDropdownProps> = ({
  taskId,
  toggleOpen,
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
    <Menu>
      <MenuButton
        onClick={toggleOpen}
        className="relative z-30 rounded-lg p-1.5 opacity-0 hover:bg-gray-100 group-hover:opacity-100 data-[open]:opacity-100"
      >
        <EllipsisVertical size={18} />
      </MenuButton>

      <MenuItems
        transition
        anchor="bottom end"
        className="absolute z-50 min-w-[150px] rounded-xl border border-gray-200 bg-white p-1.5 text-sm/6 transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
      >
        <div>
          {actions.map((action) => (
            <MenuItem key={action.id}>
              <button
                className="flex w-full items-center justify-start gap-2 rounded-md px-2 py-1.5 hover:bg-gray-100"
                onClick={() => action.action()}
              >
                {action.icon}
                <span className="text-xs font-medium">{action.title}</span>
              </button>
            </MenuItem>
          ))}
        </div>
      </MenuItems>
    </Menu>
  );
};
