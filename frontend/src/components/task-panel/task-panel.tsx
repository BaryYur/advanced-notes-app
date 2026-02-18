import React, { useState, useEffect, useRef, useCallback } from "react";

import { createPortal } from "react-dom";

import { TaskList } from "@/types";

import { TaskSupabaseService } from "@/services";

import { Button, Checkbox } from "@/components";
import { DatePickerDropdown, TaskListDropdown } from "../task-field";

import { X } from "lucide-react";

interface TaskPanelProps {
  data: {
    id: string;
    title: string;
    completed: boolean;
    date: Date | null;
    note: string;
    taskList: TaskList | undefined;
  };
  isOpen: boolean;
  onClose: () => void;
}

export const TaskPanel: React.FC<TaskPanelProps> = ({
  data,
  isOpen,
  onClose,
}) => {
  const [task, setTask] = useState({
    ...data,
    taskListId: data.taskList?.id ?? null,
  });
  const [isTitleTextareaFocused, setIsTitleTextareaFocused] = useState(false);
  const titleRef = useRef<HTMLTextAreaElement>(null);

  const titleAdjustHeight = () => {
    const textarea = titleRef.current;

    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    titleAdjustHeight();
  }, [task.title, isTitleTextareaFocused]);

  const handleCompleteTask = () => {
    setTask({ ...task, completed: !task.completed });
  };

  const handleUpdateTask = useCallback(async () => {
    await TaskSupabaseService.updateTask(data.id, {
      title: task.title,
      completed: task.completed,
      date: task.date,
      note: task.note,
      taskListId: task.taskListId,
    });
  }, [data.id, task]);

  const handleUpdateTitle = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTask({ ...task, title: event.target.value });
  };

  const handleUpdateNote = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTask({ ...task, note: event.target.value });
  };

  const handleDeleteTask = useCallback(async () => {
    onClose();
    await TaskSupabaseService.deleteTask(data.id);
  }, [data.id, onClose]);

  useEffect(() => {
    handleUpdateTask();
  }, [handleUpdateTask]);

  return createPortal(
    <>
      {isOpen && (
        <div
          className="fixed left-0 top-0 z-30 h-full w-full"
          onClick={onClose}
        />
      )}

      <div
        className={`${!isOpen ? "-right-[400px]" : ""} ${isOpen ? "right-2.5" : ""} fixed bottom-2.5 top-2.5 z-40 h-[calc(100%-20px)] w-[320px] overflow-y-auto rounded-2xl bg-white p-3.5 pt-10 shadow transition-all`}
      >
        <Button
          onClick={onClose}
          variant="ghost"
          size="sm"
          className="h-6.5 w-7.5 absolute right-2 top-2 text-zinc-500"
        >
          <X size={16} strokeWidth={2.2} />
        </Button>

        <div className="flex h-full flex-col justify-between">
          <div className="flex h-fit flex-col gap-3">
            <div className="flex h-fit gap-3">
              <Checkbox
                checked={data.completed}
                onClick={handleCompleteTask}
                className="h-[18px] w-[18px] rounded-md border-transparent bg-gray-200 shadow-none"
              />

              <textarea
                ref={titleRef}
                rows={1}
                value={
                  task.title.length > 30 && !isTitleTextareaFocused
                    ? task.title.slice(0, 30) + "..."
                    : task.title
                }
                onFocus={() => setIsTitleTextareaFocused(true)}
                onBlur={() => setIsTitleTextareaFocused(false)}
                onChange={handleUpdateTitle}
                className={`${data.completed && !isTitleTextareaFocused ? "line-through" : ""} h-fit w-full resize-none overflow-hidden`}
              />
            </div>

            <div className="flex flex-col gap-4 rounded-xl bg-gray-100 p-4">
              <div className="flex items-center justify-between gap-5">
                <span className="text-sm text-gray-400">List</span>
                <div>
                  <TaskListDropdown
                    isTaskBar
                    currentTaskList={task.taskList}
                    onSelectList={(value) => {
                      setTask({
                        ...task,
                        taskListId: value.id === "" ? null : value.id,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between gap-5">
                <span className="text-sm text-gray-400">Date</span>
                <DatePickerDropdown
                  value={task.date}
                  isTaskBar
                  onSelect={(value) =>
                    setTask({ ...task, date: value ? value : null })
                  }
                />
              </div>
            </div>

            <textarea
              placeholder="Note"
              value={task.note}
              rows={5}
              onChange={handleUpdateNote}
              className="custom-scrollbar w-full resize-none rounded-xl border border-yellow-200/20 bg-yellow-200/20 p-4 text-sm text-stone-500 focus:border-amber-100"
            />
          </div>

          <Button
            variant="ghost"
            onClick={handleDeleteTask}
            className="border-none bg-red-400/15 py-3 text-red-400 hover:bg-red-400/25 hover:text-red-400"
          >
            Delete
          </Button>
        </div>
      </div>
    </>,
    document.body,
  );
};
