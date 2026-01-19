import { Test, TestingModule } from "@nestjs/testing";
import { NotFoundException, ConflictException } from "@nestjs/common";

import { TaskListService } from "./task-list.service";
import { DatabaseService } from "../database/database.service";

describe("TaskListService", () => {
  let service: TaskListService;
  let databaseService: DatabaseService;

  const mockDatabaseService = {
    user: {
      findUnique: jest.fn(),
    },
    taskList: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    task: {
      deleteMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskListService,
        { provide: DatabaseService, useValue: mockDatabaseService },
      ],
    }).compile();

    service = module.get<TaskListService>(TaskListService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("createTaskList", () => {
    it("should throw NotFoundException if user not found", async () => {
      mockDatabaseService.user.findUnique.mockResolvedValue(null);
      await expect(
        service.createTaskList("u1", { name: "L1" }),
      ).rejects.toThrow(NotFoundException);
    });

    it("should create a task list", async () => {
      mockDatabaseService.user.findUnique.mockResolvedValue({ id: "u1" });
      const taskList = { id: "l1", name: "L1", userId: "u1" };
      mockDatabaseService.taskList.create.mockResolvedValue(taskList);

      const result = await service.createTaskList("u1", { name: "L1" });
      expect(result).toEqual(taskList);
    });
  });

  describe("findTaskListsByUserId", () => {
    it("should return task lists with tasks counted", async () => {
      const taskLists = [
        { id: "l1", tasks: [{ completed: false }, { completed: true }] },
      ];
      mockDatabaseService.taskList.findMany.mockResolvedValue(taskLists);

      const result = await service.findTaskListsByUserId("u1");
      expect(result[0]).toHaveProperty("tasksCounter", 1);
    });
  });

  describe("deleteTaskList", () => {
    it("should delete task list", async () => {
      mockDatabaseService.taskList.delete.mockResolvedValue({ id: "l1" });
      const result = await service.deleteTaskList("l1");
      expect(result.message).toBe("Task list deleted successfully");
    });

    it("should throw ConflictException on deletion failure", async () => {
      mockDatabaseService.taskList.delete.mockRejectedValue(new Error());
      await expect(service.deleteTaskList("l1")).rejects.toThrow(
        ConflictException,
      );
    });
  });
});
