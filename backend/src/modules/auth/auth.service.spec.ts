import { Test, TestingModule } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";
import {
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from "@nestjs/common";
import { UserAuthType } from "@prisma/client";
import * as bcrypt from "bcrypt";

import { AuthService } from "./auth.service";
import { UserService } from "../user/user.service";
import { MailService } from "../mail/mail.service";
import { DatabaseService } from "../database";

jest.mock("bcrypt");

describe("AuthService", () => {
  let service: AuthService;

  const mockUserService = {
    findUserByEmail: jest.fn(),
    createUser: jest.fn(),
    findUserById: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockDatabaseService = {
    user: {
      update: jest.fn(),
    },
  };

  const mockMailService = {
    sendResetCode: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: DatabaseService, useValue: mockDatabaseService },
        { provide: MailService, useValue: mockMailService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("signUp", () => {
    it("should throw BadRequestException if user already exists", async () => {
      mockUserService.findUserByEmail.mockResolvedValue({ id: "1" });
      const dto = {
        email: "test@test.com",
        authType: UserAuthType.email,
        password: "pw",
        firstName: "F",
        lastName: "L",
      };

      await expect(service.signUp(dto)).rejects.toThrow(BadRequestException);
    });

    it("should hash password and create user", async () => {
      mockUserService.findUserByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPw");
      const user = { id: "1", email: "test@test.com", password: "hashedPw" };
      mockUserService.createUser.mockResolvedValue(user);
      mockJwtService.sign.mockReturnValue("token");

      const dto = {
        email: "test@test.com",
        authType: UserAuthType.email,
        password: "pw",
        firstName: "F",
        lastName: "L",
      };
      const result = await service.signUp(dto);

      expect(bcrypt.hash).toHaveBeenCalledWith("pw", 10);
      expect(mockUserService.createUser).toHaveBeenCalled();
      expect(result).toHaveProperty("accessToken", "token");
    });
  });

  describe("signIn", () => {
    it("should throw UnauthorizedException if user not found", async () => {
      mockUserService.findUserByEmail.mockResolvedValue(null);
      const dto = {
        email: "test@test.com",
        authType: UserAuthType.email,
        password: "pw",
      };

      await expect(service.signIn(dto)).rejects.toThrow(UnauthorizedException);
    });

    it("should throw UnauthorizedException if password does not match", async () => {
      const user = {
        id: "1",
        email: "test@test.com",
        password: "hashedPw",
        authType: UserAuthType.email,
      };
      mockUserService.findUserByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const dto = {
        email: "test@test.com",
        authType: UserAuthType.email,
        password: "pw",
      };
      await expect(service.signIn(dto)).rejects.toThrow(UnauthorizedException);
    });

    it("should return token if credentials are valid", async () => {
      const user = {
        id: "1",
        email: "test@test.com",
        password: "hashedPw",
        authType: UserAuthType.email,
      };
      mockUserService.findUserByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue("token");

      const dto = {
        email: "test@test.com",
        authType: UserAuthType.email,
        password: "pw",
      };
      const result = await service.signIn(dto);

      expect(result).toHaveProperty("accessToken", "token");
    });
  });

  describe("getResetPasswordCode", () => {
    it("should throw NotFoundException if user not found", async () => {
      mockUserService.findUserByEmail.mockResolvedValue(null);
      const dto = { email: "test@test.com" };

      await expect(service.getResetPasswordCode(dto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it("should send mail and update user with reset code", async () => {
      const user = { id: "1", email: "test@test.com" };
      mockUserService.findUserByEmail.mockResolvedValue(user);

      const dto = { email: "test@test.com" };
      await service.getResetPasswordCode(dto);

      expect(mockMailService.sendResetCode).toHaveBeenCalled();
      expect(mockDatabaseService.user.update).toHaveBeenCalledWith({
        where: { id: user.id },
        data: expect.objectContaining({
          passwordResetCode: expect.any(Number),
          passwordResetCodeExpiresAt: expect.any(Date),
        }),
      });
    });
  });

  describe("resetPassword", () => {
    it("should throw NotFoundException if user not found", async () => {
      mockUserService.findUserByEmail.mockResolvedValue(null);
      const dto = {
        email: "test@test.com",
        verificationCode: 123456,
        newPassword: "new",
      };

      await expect(service.resetPassword(dto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it("should throw BadRequestException if code is invalid", async () => {
      const user = {
        id: "1",
        email: "test@test.com",
        passwordResetCode: 111111,
        passwordResetCodeExpiresAt: new Date(Date.now() + 10000),
      };
      mockUserService.findUserByEmail.mockResolvedValue(user);

      const dto = {
        email: "test@test.com",
        verificationCode: 123456,
        newPassword: "new",
      };
      await expect(service.resetPassword(dto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it("should update password if code is valid", async () => {
      const user = {
        id: "1",
        email: "test@test.com",
        passwordResetCode: 123456,
        passwordResetCodeExpiresAt: new Date(Date.now() + 10000),
      };
      mockUserService.findUserByEmail.mockResolvedValue(user);
      (bcrypt.hash as jest.Mock).mockResolvedValue("newHashedPw");

      const dto = {
        email: "test@test.com",
        verificationCode: 123456,
        newPassword: "new",
      };
      await service.resetPassword(dto);

      expect(mockDatabaseService.user.update).toHaveBeenCalledWith({
        where: { id: user.id },
        data: { password: "newHashedPw" },
      });
    });
  });
});
