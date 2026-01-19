import { Test, TestingModule } from "@nestjs/testing";
import { TaskGateway } from "./task-gateway";
import { TaskService } from "./task.service";
import { TaskListService } from "../task-list/task-list.service";
import { TaskListType } from "@prisma/client";

import { WsJwtGuard } from "../auth/ws-jwt-auth.guard";

describe("TaskGateway", () => {
  let gateway: TaskGateway;
  let taskService: TaskService;
  let taskListService: TaskListService;

  const mockTaskService = {
    create: jest.fn(),
    findAllUserTasks: jest.fn(),
    getHomeTasks: jest.fn(),
    updateTasksIndexes: jest.fn(),
    getCompletedTasks: jest.fn(),
    removeAllTasks: jest.fn(),
  };

  const mockTaskListService = {
    findTaskListsByUserId: jest.fn(),
  };

  const mockServer = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskGateway,
        { provide: TaskService, useValue: mockTaskService },
        { provide: TaskListService, useValue: mockTaskListService },
      ],
    })
      .overrideGuard(WsJwtGuard)
      .useValue({ canActivate: () => true })
      .compile();

    gateway = module.get<TaskGateway>(TaskGateway);
    taskService = module.get<TaskService>(TaskService);
    taskListService = module.get<TaskListService>(TaskListService);
    gateway.server = mockServer as any;
  });

  it("should be defined", () => {
    expect(gateway).toBeDefined();
  });

  describe("createTaskList (actually createTask)", () => {
    it("should call taskService.create and emit events", async () => {
      const task = { id: "1", userId: "u1" };
      mockTaskService.create.mockResolvedValue(task);
      mockTaskListService.findTaskListsByUserId.mockResolvedValue([]);
      mockTaskService.findAllUserTasks.mockResolvedValue([]);

      const dto = {
        taskListType: TaskListType.home,
        task: {
          userId: "u1",
          title: "T",
          date: new Date(),
          taskListType: TaskListType.home,
        },
      };

      const result = await gateway.createTaskList(dto);

      expect(taskService.create).toHaveBeenCalledWith(dto);
      expect(mockServer.emit).toHaveBeenCalledWith("taskCreated", task);
      expect(result).toHaveProperty("event", "userHomeTasks");
    });
  });
});
