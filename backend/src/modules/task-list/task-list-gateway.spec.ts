import { Test, TestingModule } from "@nestjs/testing";
import { TaskListGateway } from "./task-list-gateway";
import { TaskListService } from "./task-list.service";
import { WsJwtGuard } from "../auth/ws-jwt-auth.guard";

describe("TaskListGateway", () => {
  let gateway: TaskListGateway;
  let taskListService: TaskListService;

  const mockTaskListService = {
    findTaskList: jest.fn(),
    createTaskList: jest.fn(),
    updateTaskList: jest.fn(),
    findTaskListsByUserId: jest.fn(),
    deleteTaskList: jest.fn(),
  };

  const mockServer = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskListGateway,
        { provide: TaskListService, useValue: mockTaskListService },
      ],
    })
      .overrideGuard(WsJwtGuard)
      .useValue({ canActivate: () => true })
      .compile();

    gateway = module.get<TaskListGateway>(TaskListGateway);
    taskListService = module.get<TaskListService>(TaskListService);
    gateway.server = mockServer as any;
  });

  it("should be defined", () => {
    expect(gateway).toBeDefined();
  });

  describe("createTaskList", () => {
    it("should call taskListService.createTaskList and emit event", async () => {
      const user = { id: "u1" };
      const dto = { name: "New List" };
      const taskList = { id: "l1", ...dto, userId: "u1" };
      mockTaskListService.createTaskList.mockResolvedValue(taskList);

      await gateway.createTaskList(dto, user as any);

      expect(taskListService.createTaskList).toHaveBeenCalledWith("u1", dto);
      expect(mockServer.emit).toHaveBeenCalledWith("taskListCreated", taskList);
    });
  });

  describe("getTaskListsByUserId", () => {
    it("should return task lists through WsResponse", async () => {
      const taskLists = [{ id: "l1" }];
      mockTaskListService.findTaskListsByUserId.mockResolvedValue(taskLists);

      const result = await gateway.getTaskListsByUserId("u1");

      expect(result).toEqual({ event: "taskListsByUserId", data: taskLists });
    });
  });
});
