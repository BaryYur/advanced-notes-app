import React from "react";

import { TaskList } from "@/types";

import { useOutsideClick } from "@/hooks";

import { TaskApiService } from "@/services";

import { Checkbox, ListIcon } from "@/components";
import { SortableList } from "./sortable-list";
import { TaskListItemDropdown } from "./task-list-item-dropdown";

import { motion } from "framer-motion";

import { AlignLeft } from "lucide-react";

import { format, isBefore } from "date-fns";
import { enUS } from "date-fns/locale";

interface TaskListItemProps {
  id: string;
  index: number;
  isLast: boolean;
  title: string;
  completed: boolean;
  date?: Date;
  note: string;
  taskList: TaskList | null;
}

export const TaskListItem: React.FC<TaskListItemProps> = ({
  id,
  index,
  isLast,
  title,
  completed,
  date,
  note,
  taskList,
}) => {
  const { isActive, setIsActive, elementRef } = useOutsideClick<HTMLDivElement>(
    {
      onOutsideClick: () => setIsActive(false),
    },
  );

  // const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCompleteTask = (event: React.FormEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    TaskApiService.updateTask({
      id,
      task: {
        completed: !completed,
      },
    });
  };

  const isExpired = date ? isBefore(date, new Date()) : false;

  return (
    <>
      <motion.div
        key={id}
        className={`${index === 0 && "rounded-t-xl"} ${isLast && "rounded-b-xl"} group relative z-20 flex h-12 w-full cursor-pointer items-center justify-between overflow-hidden rounded-md bg-white p-3`}
        layoutId={id}
        // onClick={() => {
        //   console.log(id);
        //   // setIsModalOpen(true);
        // }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <div>
          <div className="relative z-30 flex items-center gap-3">
            <Checkbox
              checked={completed}
              onClick={handleCompleteTask}
              className="h-[18px] w-[18px] rounded-md border-transparent bg-gray-200 shadow-none"
            />
            <span className={`${completed && "line-through"} text-sm`}>
              {title}
            </span>
          </div>
        </div>

        <div ref={elementRef}>
          <TaskListItemDropdown
            taskId={id}
            toggleOpen={() => setIsActive((active) => !active)}
          />
        </div>

        <div
          className={`${isActive && "opacity-0"} absolute inset-y-1 right-3 flex items-center gap-1.5 transition-all duration-200 group-hover:opacity-0`}
        >
          {note !== "" && (
            <div className="rounded-sm border-2 border-gray-300 p-0.5 text-gray-400">
              <AlignLeft size={9} />
            </div>
          )}

          {date && (
            <div
              className={`${isExpired ? "bg-red-100/70 text-red-500/70" : "bg-gray-100 text-gray-500"} rounded-md px-1.5 py-0.5 text-xs font-medium`}
            >
              {format(date, "dd MMM", { locale: enUS })}
            </div>
          )}

          {taskList && (
            <ListIcon color={taskList.color} emoji={taskList.emoji} />
          )}
        </div>

        <SortableList.DragHandle />
      </motion.div>

      {/* <TaskModal
        id={id}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      /> */}
    </>
  );
};
