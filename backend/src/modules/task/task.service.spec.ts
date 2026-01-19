import { Test, TestingModule } from "@nestjs/testing";
import { NotFoundException } from "@nestjs/common";
import { TaskListType } from "@prisma/client";

import { TaskService } from "./task.service";
import { DatabaseService } from "../database/database.service";

describe("TaskService", () => {
  let service: TaskService;
  let databaseService: DatabaseService;

  const mockDatabaseService = {
    task: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
    taskList: {
      findUnique: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        { provide: DatabaseService, useValue: mockDatabaseService },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should create a task and update indexes", async () => {
      mockDatabaseService.task.findMany.mockResolvedValue([]);
      mockDatabaseService.$transaction.mockResolvedValue([]);
      const task = { id: "1", title: "Task" };
      mockDatabaseService.task.create.mockResolvedValue(task);

      const result = await service.create({
        taskListType: TaskListType.home,
        task: {
          userId: "u1",
          title: "Task",
          date: new Date(),
          taskListType: TaskListType.home,
        },
      });

      expect(result).toEqual(task);
      expect(mockDatabaseService.task.create).toHaveBeenCalled();
    });
  });

  describe("updateTaskListId", () => {
    it("should throw NotFoundException if task list not found", async () => {
      mockDatabaseService.taskList.findUnique.mockResolvedValue(null);
      await expect(service.updateTaskListId("t1", "tl1")).rejects.toThrow(
        NotFoundException,
      );
    });

    it("should update task list id", async () => {
      mockDatabaseService.taskList.findUnique.mockResolvedValue({ id: "tl1" });
      await service.updateTaskListId("t1", "tl1");
      expect(mockDatabaseService.task.update).toHaveBeenCalledWith({
        where: { id: "t1" },
        data: { taskListId: "tl1" },
      });
    });
  });

  describe("findAllUserTasks", () => {
    it("should return all user tasks", async () => {
      const tasks = [{ id: "1", userId: "u1" }];
      mockDatabaseService.task.findMany.mockResolvedValue(tasks);
      const result = await service.findAllUserTasks("u1");
      expect(result).toEqual(tasks);
    });
  });

  describe("removeTask", () => {
    it("should delete a task", async () => {
      await service.removeTask("t1");
      expect(mockDatabaseService.task.delete).toHaveBeenCalledWith({
        where: { id: "t1" },
      });
    });
  });
});
