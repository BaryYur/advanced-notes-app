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
    updateUserInfo: jest.fn(),
    deleteUser: jest.fn(),
    changePassword: jest.fn(),
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

  describe("updateUserInfo", () => {
    it("should update and return user info", async () => {
      const dto = { firstName: "Updated", lastName: "Name" };
      const updatedUser = { id: "1", email: "test@test.com", ...dto };
      mockUserService.updateUserInfo.mockResolvedValue(updatedUser);

      const req = { user: { id: "1" } } as RequestWithUser;
      const result = await controller.updateUserInfo(req, dto);

      expect(userService.updateUserInfo).toHaveBeenCalledWith("1", dto);
      expect(result).toEqual(updatedUser);
    });
  });

  describe("deleteUser", () => {
    it("should delete user", async () => {
      mockUserService.deleteUser.mockResolvedValue(undefined);

      const req = { user: { id: "1" } } as RequestWithUser;
      await controller.deleteUser(req);

      expect(userService.deleteUser).toHaveBeenCalledWith("1");
    });
  });

  describe("changePassword", () => {
    it("should call changePassword on service and return the result", async () => {
      const dto = { oldPassword: "old", newPassword: "new" };
      const resultUser = { id: "1", email: "test@test.com" };
      mockUserService.changePassword.mockResolvedValue(resultUser);

      const req = { user: { id: "1" } } as RequestWithUser;
      const result = await controller.changePassword(req, dto);

      expect(userService.changePassword).toHaveBeenCalledWith("1", dto);
      expect(result).toEqual(resultUser);
    });
  });
});
