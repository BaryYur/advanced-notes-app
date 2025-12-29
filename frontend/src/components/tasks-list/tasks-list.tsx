import React from "react";

import { ListType, Task } from "@/types";

import { TaskListItem } from "./task-list-item";
import { SortableList } from "./sortable-list";

import { socket } from "@/lib";

interface TasksListProps {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
}

export const TasksList: React.FC<TasksListProps> = ({ tasks, setTasks }) => {
  const handleIndexChanges = (listType: ListType, items: Task[]) => {
    setTasks(items);

    const itemsWithIndex = items.map((item, index) => ({ ...item, index }));

    socket.emit("updateTaskIndexes", { listType, tasks: itemsWithIndex });
  };

  return (
    <div className="mt-5 pb-20">
      <SortableList
        items={tasks}
        onChange={handleIndexChanges}
        renderItem={(task, index) => (
          <SortableList.Item id={task.id}>
            <TaskListItem
              index={index}
              isLast={index + 1 === tasks.length}
              id={task.id}
              title={task.title}
              completed={task.completed}
              date={task.date}
              note={task.note}
              taskList={task.taskList}
            />
          </SortableList.Item>
        )}
      />
    </div>
  );
};
