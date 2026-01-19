import { Injectable, NotFoundException } from "@nestjs/common";

import { DatabaseService } from "../database/database.service";

import { TaskListType } from "@prisma/client";

import { CreateTaskDto } from "./dto/create-task-dto";
import { UpdateTaskDto } from "./dto/update-task-dto";
import { UpdateTasksIndexesDto } from "./dto/update-tasks-indexes-dto";

@Injectable()
export class TaskService {
  constructor(private readonly database: DatabaseService) {}

  async create(createTaskDto: {
    taskListType: TaskListType;
    task: CreateTaskDto;
  }) {
    const tasks = await this.database.task.findMany({
      where: {
        userId: createTaskDto.task.userId,
      },
    });

    const updatedTasks = tasks.map((task, index) => ({
      index,
      ...task,
      homeIndex: task.homeIndex + 1,
    }));

    await this.updateTasksIndexes({
      listType: TaskListType.home,
      tasks: updatedTasks,
    });

    // console.log(tasks, "tasks");
    // await this.updateTasksIndexes();

    const task = await this.database.task.create({
      data: {
        ...createTaskDto.task,
      },
    });

    // update by type
    // home by default

    return task;
  }

  async updateTaskListId(taskId: string, taskListId: string) {
    // if completed update set completedIndex = 0 and set other completed index + 1
    const taskList = await this.database.taskList.findUnique({
      where: {
        id: taskListId,
      },
    });

    if (!taskList) {
      throw new NotFoundException("Task list not found");
    }

    await this.database.task.update({
      where: {
        id: taskId,
      },
      data: {
        taskListId,
      },
    });
  }

  async updateTasksIndexes(updateTasksIndexesDto: UpdateTasksIndexesDto) {
    // update index
    // items // if (home) find and update all items and indexes { home: newIndex } else (default) { default: newIndex }
    const { tasks, listType } = updateTasksIndexesDto;
    const typeIndex = `${listType}Index`;

    const updatedTasks = await this.database.$transaction(
      tasks.map((update) =>
        this.database.task.update({
          where: { id: update.id },
          data: {
            [typeIndex]: update.index,
          },
        }),
      ),
    );

    return updatedTasks;
  }

  async findByTaskListId(id: string) {
    const tasks = await this.database.task.findMany({
      where: {
        taskListId: id,
        completed: false,
      },
      include: {
        taskList: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return tasks;
  }

  async findAllUserTasks(userId: string) {
    const tasks = await this.database.task.findMany({
      where: {
        userId,
      },
      include: {
        taskList: true,
      },
    });

    return tasks;
  }

  async findOneTask(id: string) {
    const task = await this.database.task.findUnique({
      where: {
        id,
      },
    });

    return task;
  }

  async updateTask(id: string, updateTaskDto: UpdateTaskDto) {
    await this.database.task.update({
      where: {
        id,
      },
      data: {
        ...updateTaskDto,
      },
    });
  }

  async removeTask(id: string) {
    await this.database.task.delete({
      where: {
        id,
      },
    });
  }

  async getHomeTasks(userId: string) {
    const tasks = await this.database.task.findMany({
      where: {
        userId,
        completed: false,
      },
      include: {
        taskList: true,
      },
    });

    tasks.sort((a, b) => a.homeIndex - b.homeIndex);

    return tasks;
  }

  async getTodayTasks(_userId: string) {}

  async getCompletedTasks(userId: string) {
    const tasks = await this.database.task.findMany({
      where: {
        userId,
        completed: true,
      },
      include: {
        taskList: true,
      },
    });

    if (!tasks) {
      throw new NotFoundException("Tasks not found");
    }

    return tasks;
  }

  async removeAllTasks(removeAllTasksDto: {
    userId: string;
    listType: TaskListType;
    listId: string;
  }) {
    const { userId, listType } = removeAllTasksDto;

    const deleteHomeTasks = async () => {
      console.log("delete home");

      await this.database.task.deleteMany({
        where: {
          userId,
        },
      });
    };

    switch (listType) {
      case TaskListType.home:
        await deleteHomeTasks();
        break;
      case TaskListType.today:
        console.log("today");
        break;
      case TaskListType.completed:
        console.log("completed");
        break;
      case TaskListType.default:
        console.log("def");
        break;
      default:
        throw new NotFoundException("List type is not correct");
    }
  }
}
