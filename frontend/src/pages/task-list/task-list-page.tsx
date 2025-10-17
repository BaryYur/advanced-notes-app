import { useContext, useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import { Task } from "@/types";

import { AuthContext } from "@/context";

import { TaskList, ListType } from "@/types";

import {
  PageLayout,
  BackgroundWrapper,
  TaskField,
  TasksList,
} from "@/components";

import { socket } from "@/vars";

export const TaskListPage = () => {
  const params = useParams();
  const { user } = useContext(AuthContext);

  const [taskList, setTaskList] = useState<TaskList | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (user) {
      socket.emit("getTaskList", { userId: user.id, name: params.name });

      const handleGetTaskList = (data: TaskList) => {
        setTaskList(data);
      };

      socket.on("taskListFetched", handleGetTaskList);

      return () => {
        socket.off("taskListFetched");
      };
    }
  }, [user, params]);

  useEffect(() => {
    if (taskList) {
      socket.emit("getListTasks", taskList.id);

      const handleGetTasks = (tasksData: Task[]) => {
        setTasks(tasksData);
      };

      const handleCreateTask = (taskData: Task) => {
        if (taskData.taskListId === taskList.id) {
          setTasks((prevTasks) => [taskData, ...prevTasks]);
        }
      };

      // const handleUpdateTask = (task: Partial<Task>) => {
      //   console.log("update", task);
      //   socket.emit("updateTaskList", task);
      // }

      socket.on("userListTasks", handleGetTasks);
      socket.on("taskCreated", handleCreateTask);
      // socket.on("taskUpdated", handleUpdateTask());

      return () => {
        socket.off("userListTasks", handleGetTasks);
        socket.off("taskCreated");
        socket.off("taskRemoved");
      };
    }
  }, [taskList]);

  return (
    <>
      {taskList && (
        <PageLayout
          pageType={ListType.Default}
          defaultPageData={{
            id: taskList.id,
            name: taskList.name,
            color: taskList.color,
            emoji: taskList?.emoji,
          }}
        >
          <TaskField listType={ListType.Default} values={{ taskList }} />
          <TasksList tasks={tasks} setTasks={(tasks) => setTasks(tasks)} />
        </PageLayout>
      )}

      <BackgroundWrapper currentColor={taskList?.color} />
    </>
  );
};
