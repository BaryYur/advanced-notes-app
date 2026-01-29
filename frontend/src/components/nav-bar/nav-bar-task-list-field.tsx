import React, { useContext, useRef, useState } from "react";

import { AuthContext, TaskListContext } from "@/context";

import { useEnterKeys, useOutsideClick } from "@/hooks";

import { TaskListSupabaseService } from "@/services";

import { TaskList } from "@/types";

import { TaskListIconPicker } from "@/components";

import { COLORS } from "@/lib/data";

import { Command } from "lucide-react";

import toast from "react-hot-toast";

interface NavBarCreateTaskListFieldProps {
  action: "create" | "update";
  onUpdateAction?: () => void;
  isInLinkPickerOpen?: boolean;
  onOpenPickerInNavLink?: () => void;
  taskListData?: Omit<Omit<TaskList, "userId">, "tasksCounter">;
}

export const NavBarTaskListField: React.FC<NavBarCreateTaskListFieldProps> = ({
  action,
  onUpdateAction,
  isInLinkPickerOpen,
  onOpenPickerInNavLink,
  taskListData,
}) => {
  const { user } = useContext(AuthContext);
  const { checkIsTaskListNameAvailable } = useContext(TaskListContext);

  const [formData, setFormData] = useState({
    taskListName: taskListData?.name ?? "",
    selectedColor: taskListData?.color ?? COLORS[0],
    isActive: !!taskListData,
  });

  const [isTaskListIconPickedOpen, setIsTaskListIconPickerOpen] = useState(
    isInLinkPickerOpen ?? false,
  );

  const inputRef = useRef<HTMLInputElement>(null);

  const handleEnterKeys = (event: KeyboardEvent) => {
    if (event.ctrlKey && event.key.toLowerCase() === "d") {
      event.preventDefault();

      inputRef.current?.focus();
      setFormData({
        ...formData,
        isActive: true,
      });
    }
  };

  useEnterKeys(handleEnterKeys);

  const handleClickOutside = () => {
    if (isTaskListIconPickedOpen) {
      setIsTaskListIconPickerOpen(false);
      inputRef.current?.focus();
    }

    if (formData.taskListName === "" && !isTaskListIconPickedOpen) {
      setFormData({ ...formData, isActive: false });
    }
  };

  const { elementRef: formRef } = useOutsideClick<HTMLFormElement>({
    onOutsideClick: handleClickOutside,
    dependencies: [formData, isTaskListIconPickedOpen],
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (formData.taskListName === "") {
      toast.error("Name cannot be empty");
      return;
    }

    if (!user) return;

    if (action === "create") {
      if (!checkIsTaskListNameAvailable("", formData.taskListName)) {
        toast.error("You already have list with this name");
        return;
      }

      const newList = await TaskListSupabaseService.createTaskList({
        name: formData.taskListName.trim(),
        userId: user.id,
        color: formData.selectedColor.trim(),
      });

      if (newList) {
        setFormData({
          ...formData,
          taskListName: "",
          isActive: false,
        });
      }
    }

    if (action === "update" && taskListData) {
      if (
        !checkIsTaskListNameAvailable(taskListData.id, formData.taskListName)
      ) {
        toast.error("You already have list with this name");
        return;
      }

      await TaskListSupabaseService.updateTaskList(taskListData.id, {
        name: formData.taskListName.trim(),
        color: formData.selectedColor.trim(),
      });

      onUpdateAction?.();
    }
  };

  return (
    <div className={`${taskListData ? "mt-0" : "mt-2"}`}>
      <form
        onSubmit={handleSubmit}
        ref={formRef}
        className="group flex w-full items-center gap-0.5"
        onClick={() => setFormData({ ...formData, isActive: true })}
      >
        <TaskListIconPicker
          isActive={formData.isActive}
          selectedColor={formData.selectedColor}
          onColorChange={(color) =>
            setFormData({
              ...formData,
              selectedColor: color,
            })
          }
          onOpen={() => {
            onOpenPickerInNavLink?.();
            setIsTaskListIconPickerOpen(true);
          }}
        />

        <div className="relative">
          <input
            placeholder={formData.isActive ? "List name" : "Add task list"}
            ref={inputRef}
            value={formData.taskListName}
            className={` ${!formData.isActive && "group-hover:placeholder:text-gray-800"} ${taskListData ? "w-[130px]" : "w-[230px]"} bg-transparent px-3 text-sm`}
            onChange={(event) =>
              setFormData({
                ...formData,
                taskListName: event.target.value,
              })
            }
          />

          {!taskListData && (
            <div
              className={`${formData.isActive ? "hidden" : "visible"} absolute right-0 top-0 flex items-center gap-1`}
            >
              <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gray-100 p-1 text-sm text-gray-500">
                <Command />
              </div>
              <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gray-100 text-sm text-gray-500">
                D
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
