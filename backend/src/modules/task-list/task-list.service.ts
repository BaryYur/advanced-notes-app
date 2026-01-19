import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { TaskList, Task, TaskListType } from "@prisma/client";

import { DatabaseService } from "../database/database.service";
import { CreateTaskListDto } from "./dto/create-task-list-dto";
import { UpdateTaskListDto } from "./dto/update-task-list-dto";

type TaskListWithTasks = TaskList & { tasks: Task[] };

@Injectable()
export class TaskListService {
  constructor(private readonly database: DatabaseService) {}

  async createTaskList(
    userId: string,
    createTaskListDto: CreateTaskListDto,
  ): Promise<TaskList> {
    const user = await this.database.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const taskList = await this.database.taskList.create({
      data: {
        userId,
        ...createTaskListDto,
      },
    });

    return taskList;
  }

  async findTaskList(userId: string, name: string): Promise<TaskList> {
    const taskList = await this.database.taskList.findFirst({
      where: {
        userId,
        name,
      },
    });

    if (!taskList) {
      throw new NotFoundException("Task list not found");
    }

    return taskList;
  }

  async findTaskListsByUserId(userId: string): Promise<TaskList[]> {
    const taskLists: TaskListWithTasks[] =
      await this.database.taskList.findMany({
        where: {
          userId,
        },
        include: { tasks: true },
        orderBy: { createdAt: "asc" },
      });

    const lists: TaskList[] = [];

    for (const list of taskLists) {
      const listItem = {
        ...list,
        tasksCounter: list.tasks.filter((task) => !task.completed).length,
      };

      lists.push(listItem);
    }

    return lists;
  }

  async updateTaskList(
    taskListId: string,
    updateTaskListDto: UpdateTaskListDto,
  ) {
    const updatedTaskList = await this.database.taskList.update({
      where: {
        id: taskListId,
      },
      data: {
        ...updateTaskListDto,
      },
    });

    return updatedTaskList;
  }

  async deleteTaskList(id: string) {
    try {
      const deletedTaskList = await this.database.taskList.delete({
        where: {
          id,
        },
      });

      return { message: "Task list deleted successfully", deletedTaskList };
    } catch (_error) {
      throw new ConflictException("Task list not found or deletion failed");
    }
  }

  async deleteAllTaskListTasks(deleteDto: {
    taskListId?: string;
    taskListType: TaskListType;
  }) {
    try {
      switch (deleteDto.taskListType) {
        case "default":
          await this.database.task.deleteMany({
            where: {
              taskListId: deleteDto.taskListId,
            },
          });
        // case "home": await this.database.task.deleteMany({
        //
        // });
      }
    } catch (_error) {
      throw new ConflictException("Task list not found or deletion failed");
    }
  }
}
