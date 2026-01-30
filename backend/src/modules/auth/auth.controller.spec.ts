import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { Response } from "express";
import { UserAuthType } from "@prisma/client";

describe("AuthController", () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    signUp: jest.fn(),
    signIn: jest.fn(),
    logout: jest.fn(),
    getResetPasswordCode: jest.fn(),
    resetPassword: jest.fn(),
  };

  const mockResponse = {
    cookie: jest.fn(),
    clearCookie: jest.fn(),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("signUp", () => {
    it("should call authService.signUp and set cookie", async () => {
      const dto = {
        email: "a@a.com",
        authType: UserAuthType.email,
        password: "pw",
        firstName: "F",
        lastName: "L",
      };
      mockAuthService.signUp.mockResolvedValue({ accessToken: "token" });

      const result = await controller.signUp(dto, mockResponse);

      expect(authService.signUp).toHaveBeenCalledWith(dto);
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        "accessToken",
        "token",
        expect.any(Object),
      );
      expect(result).toEqual({ success: true });
    });
  });

  describe("signIn", () => {
    it("should call authService.signIn and set cookie", async () => {
      const dto = {
        email: "a@a.com",
        authType: UserAuthType.email,
        password: "pw",
      };
      mockAuthService.signIn.mockResolvedValue({ accessToken: "token" });

      const result = await controller.signIn(dto, mockResponse);

      expect(authService.signIn).toHaveBeenCalledWith(dto);
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        "accessToken",
        "token",
        expect.any(Object),
      );
      expect(result).toEqual({ success: true });
    });
  });

  describe("logout", () => {
    it("should clear cookie", () => {
      const result = controller.logout(mockResponse);

      expect(mockResponse.clearCookie).toHaveBeenCalledWith("accessToken", {
        path: "/",
        secure: true,
        sameSite: "lax",
      });
      expect(result).toEqual({ success: true });
    });
  });
});
