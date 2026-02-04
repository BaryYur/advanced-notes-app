import { motion, AnimatePresence } from "framer-motion";
import { ListType, Task } from "@/types";

import { TaskListItem } from "./task-list-item";
import { SortableList } from "./sortable-list";
import { TasksEmptyState } from "./tasks-empty-state";

interface TasksListProps {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
}

export const TasksList: React.FC<TasksListProps> = ({ tasks, setTasks }) => {
  const handleIndexChanges = (_listType: ListType, items: Task[]) => {
    setTasks(items);

    // const itemsWithIndex = items.map((item, index) => ({ ...item, index }));

    // socket.emit("updateTaskIndexes", { listType, tasks: itemsWithIndex });
  };

  return (
    <div className="mt-5 pb-20">
      <AnimatePresence initial={false}>
        <SortableList
          items={tasks}
          onChange={handleIndexChanges}
          renderItem={(task, index) => (
            <motion.li
              key={task.id}
              layout
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{
                opacity: 0,
                scale: 0.95,
                y: 10,
                transition: { duration: 0.2 },
              }}
              style={{ listStyle: "none" }}
            >
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
            </motion.li>
          )}
        />
      </AnimatePresence>

      {tasks.length === 0 && <TasksEmptyState />}
    </div>
  );
};
