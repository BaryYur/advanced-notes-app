import { Test, TestingModule } from "@nestjs/testing";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { RequestWithUser } from "../../common/types";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

describe("UserController", () => {
  let controller: UserController;
  let userService: UserService;

  const mockUserService = {
    findUserById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("getUserInfo", () => {
    it("should return user info", async () => {
      const user = { id: "1", email: "test@test.com" };
      mockUserService.findUserById.mockResolvedValue(user);

      const req = { user: { id: "1" } } as RequestWithUser;
      const result = await controller.getUserInfo(req);

      expect(userService.findUserById).toHaveBeenCalledWith("1");
      expect(result).toEqual(user);
    });
  });
});
