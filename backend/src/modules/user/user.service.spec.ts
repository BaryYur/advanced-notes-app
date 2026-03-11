import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service";
import { DatabaseService } from "../database";
import { UserAuthType } from "@prisma/client";
import * as bcrypt from "bcrypt";

jest.mock("bcrypt");

describe("UserService", () => {
  let service: UserService;
  let mockDatabaseService: any;

  beforeEach(async () => {
    mockDatabaseService = {
      user: {
        create: jest.fn(),
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("createUser", () => {
    it("should create a user", async () => {
      const userData = {
        email: "test@example.com",
        firstName: "John",
        lastName: "Doe",
        authType: UserAuthType.email,
        password: "hashedPassword",
      };
      mockDatabaseService.user.create.mockResolvedValue(userData);

      const result = await service.createUser(userData);

      expect(result).toEqual(userData);
      expect(mockDatabaseService.user.create).toHaveBeenCalledWith({
        data: userData,
      });
    });
  });

  describe("findUserByEmail", () => {
    it("should find a user by email and authType", async () => {
      const email = "test@example.com";
      const authType = UserAuthType.email;
      const user = { id: "1", email, authType };
      mockDatabaseService.user.findFirst.mockResolvedValue(user);

      const result = await service.findUserByEmail(email, authType);

      expect(result).toEqual(user);
      expect(mockDatabaseService.user.findFirst).toHaveBeenCalledWith({
        where: { email, authType },
      });
    });
  });

  describe("findUserById", () => {
    it("should find a user by id", async () => {
      const id = "1";
      const user = { id, email: "test@example.com" };
      mockDatabaseService.user.findUnique.mockResolvedValue(user);

      const result = await service.findUserById(id);

      expect(result).toEqual(user);
      expect(mockDatabaseService.user.findUnique).toHaveBeenCalledWith({
        where: { id },
      });
    });
  });

  describe("updateUserInfo", () => {
    it("should update and return user info", async () => {
      const id = "1";
      const dto = { firstName: "Updated" };
      const updatedUser = { id, email: "test@example.com", ...dto };
      mockDatabaseService.user.update.mockResolvedValue(updatedUser);

      const result = await service.updateUserInfo(id, dto);

      expect(result).toEqual(updatedUser);
      expect(mockDatabaseService.user.update).toHaveBeenCalledWith({
        where: { id },
        data: { ...dto },
      });
    });
  });

  describe("deleteUser", () => {
    it("should delete user", async () => {
      const id = "1";
      mockDatabaseService.user.delete.mockResolvedValue({});

      await service.deleteUser(id);

      expect(mockDatabaseService.user.delete).toHaveBeenCalledWith({
        where: { id },
      });
    });
  });

  describe("changePassword", () => {
    const id = "1";
    const dto = { oldPassword: "oldPassword", newPassword: "newPassword" };
    const hashedPassword = "hashedPassword";
    const newHashedPassword = "newHashedPassword";
    const user = { id, email: "test@test.com", password: hashedPassword };

    it("should change password successfully", async () => {
      mockDatabaseService.user.findUnique.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue(newHashedPassword);
      mockDatabaseService.user.update.mockResolvedValue({
        ...user,
        password: newHashedPassword,
      });

      const result = await service.changePassword(id, dto);

      expect(result.password).toEqual(newHashedPassword);
      expect(mockDatabaseService.user.update).toHaveBeenCalledWith({
        where: { id },
        data: { password: newHashedPassword },
      });
    });

    it("should throw NotFoundException if user not found", async () => {
      mockDatabaseService.user.findUnique.mockResolvedValue(null);

      await expect(service.changePassword(id, dto)).rejects.toThrow(
        "User not found",
      );
    });

    it("should throw ForbiddenException if user does not have a password", async () => {
      mockDatabaseService.user.findUnique.mockResolvedValue({
        ...user,
        password: null,
      });

      await expect(service.changePassword(id, dto)).rejects.toThrow(
        "User does not have a password",
      );
    });

    it("should throw ForbiddenException if old password does not match", async () => {
      mockDatabaseService.user.findUnique.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.changePassword(id, dto)).rejects.toThrow(
        "Invalid old password",
      );
    });
  });
});
