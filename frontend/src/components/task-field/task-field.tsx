import React, { useContext, useEffect, useRef, useState } from "react";

import { AuthContext } from "@/context";

import { ListType, TaskList } from "@/types";

import { useEnterKeys, useOutsideClick } from "@/hooks";

import { TaskApiService } from "@/services";

import { socket } from "@/vars";

import { DatePickerDropdown } from "./date-picker-dropdown";
import { TaskListDropdown } from "./task-list-dropdown";

import { Command } from "lucide-react";

import toast from "react-hot-toast";

interface TaskFieldProps {
  listType: ListType;
  values?: {
    date?: Date;
    taskList?: TaskList;
  };
}

export const TaskField: React.FC<TaskFieldProps> = ({ listType, values }) => {
  const { user } = useContext(AuthContext);

  const [task, setTask] = useState<{
    title: string;
    date: Date | undefined;
    listId: string;
  }>({
    title: "",
    date: undefined,
    listId: "",
  });
  const [isDatePickerDropdownOpen, setIsDatePickerDropdownOpen] =
    useState(false);
  const [isTaskListsDropdownOpen, setIsTaskListsDropdownOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleClickOutside = () => {
    if (isDatePickerDropdownOpen || isTaskListsDropdownOpen) {
      setIsDatePickerDropdownOpen(false);
      setIsTaskListsDropdownOpen(false);
      inputRef.current?.focus();
    } else {
      setIsFormActive(false);
    }
  };

  const {
    isActive: isFormActive,
    setIsActive: setIsFormActive,
    elementRef: formRef,
  } = useOutsideClick<HTMLFormElement>({
    onOutsideClick: handleClickOutside,
    dependencies: [isDatePickerDropdownOpen, isTaskListsDropdownOpen],
  });

  const handleEnterKeys = (event: KeyboardEvent) => {
    if (event.ctrlKey && event.key.toLowerCase() === "e") {
      event.preventDefault();

      inputRef.current?.focus();
      setIsFormActive(true);
    }
  };

  useEnterKeys(handleEnterKeys);

  const handleCreateTaskSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (task.title === "") {
      toast.error("Task name can not be empty");
      return;
    }

    if (!user) return;

    TaskApiService.createTask({
      taskListType: listType,
      task: {
        userId: user.id,
        title: task.title,
        taskListId: task.listId !== "" ? task.listId : null,
        date: task.date,
      },
    });

    socket.once("taskCreated", () => {
      setTask({
        ...task,
        title: "",
      });
    });
  };

  useEffect(() => {
    if (values) {
      setTask({
        ...task,
        date: values?.date,
        listId: values.taskList?.id ?? "",
      });
    }
  }, [values]);

  return (
    <form
      ref={formRef}
      onSubmit={handleCreateTaskSubmit}
      className={`${isFormActive ? "bg-white" : "z-20 cursor-pointer bg-gray-200"} flex justify-between overflow-hidden rounded-xl transition-all duration-300`}
      onClick={() => setIsFormActive(true)}
    >
      <div className="relative flex w-full">
        <div
          className={`${isFormActive ? "left-0" : "-left-20"} absolute pb-4 pl-3 pr-4 pt-3.5 transition-all duration-500`}
        >
          <div className="h-[18px] w-[18px] rounded-md bg-gray-200" />
        </div>

        <input
          placeholder="Create a new task"
          ref={inputRef}
          value={task.title}
          onChange={(event) => setTask({ ...task, title: event.target.value })}
          className={`${isFormActive ? "white pl-11" : "cursor-pointer bg-gray-200 pl-3"} w-full py-3 pr-1 transition-all duration-300`}
        />
      </div>

      <div
        className={`${isFormActive ? "visible" : "hidden"} flex items-center gap-2 pr-3`}
      >
        <DatePickerDropdown
          value={task.date}
          onSelect={(value) => setTask({ ...task, date: value })}
          onOpen={() => setIsDatePickerDropdownOpen(true)}
        />
        <TaskListDropdown
          onOpen={() => setIsTaskListsDropdownOpen(true)}
          onInputFocus={() => inputRef.current?.focus()}
          currentTaskList={values?.taskList}
          onSelectList={(value) => setTask({ ...task, listId: value.id })}
        />
      </div>

      <div
        className={`${isFormActive ? "hidden" : "visible"} flex items-center gap-1 pr-3`}
      >
        <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gray-300 p-1 text-sm text-gray-500">
          <Command />
        </div>
        <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gray-300 text-sm text-gray-500">
          E
        </div>
      </div>
    </form>
  );
};
