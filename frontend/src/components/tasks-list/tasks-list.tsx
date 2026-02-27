import { useContext } from "react";
import { ListType, Task } from "@/types";

import { TaskSupabaseService } from "@/services";
import { TaskContext } from "@/context";

import { TaskListItem } from "./task-list-item";
import { SortableList } from "./sortable-list";
import { TasksEmptyState } from "./tasks-empty-state";

// import { motion } from "framer-motion";

interface TasksListProps {
  listId?: string;
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
}

export const TasksList: React.FC<TasksListProps> = ({
  listId,
  tasks,
  setTasks,
}) => {
  const { setIgnoreRealtime } = useContext(TaskContext);

  const handleIndexChanges = async (
    movedTaskId: string,
    listType: ListType,
    items: Task[],
  ) => {
    setIgnoreRealtime();
    const context = listId || listType;

    const index = items.findIndex((t) => t.id === movedTaskId);
    const prevTask = items[index - 1];
    const nextTask = items[index + 1];

    let newPosition: number;

    const getPosition = (task: Task) =>
      task.taskOrder.find((o) => o.context === context)?.position ?? 0;

    if (!prevTask && nextTask) {
      newPosition = getPosition(nextTask) - 1;
    } else if (prevTask && !nextTask) {
      newPosition = getPosition(prevTask) + 1;
    } else if (prevTask && nextTask) {
      newPosition = (getPosition(prevTask) + getPosition(nextTask)) / 2;
    } else {
      newPosition = 0;
    }

    const updatedItems = items.map((item) => {
      if (item.id === movedTaskId) {
        return {
          ...item,
          taskOrder: [
            ...item.taskOrder.filter((o) => o.context !== context),
            { context, position: newPosition },
          ],
        };
      }

      return item;
    });

    setTasks(updatedItems);

    await TaskSupabaseService.updateTaskOrder({
      taskId: movedTaskId,
      listContext: context,
      newIndex: newPosition,
    });
  };

  return (
    <div className="mt-5 pb-20">
      <SortableList
        items={tasks}
        onChange={handleIndexChanges}
        renderItem={(task, index) => (
          // <motion.li
          //   key={task.id}
          //   layout
          //   initial={{ opacity: 0, scale: 0.95, y: -10 }}
          //   animate={{ opacity: 1, scale: 1, y: 0 }}
          //   exit={{
          //     opacity: 0,
          //     scale: 0.9,
          //     filter: "blur(8px)",
          //     transition: { duration: 0.4 },
          //   }}
          //   style={{ listStyle: "none" }}
          // >
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
          // </motion.li>
        )}
      />

      {tasks.length === 0 && <TasksEmptyState />}
    </div>
  );
};
