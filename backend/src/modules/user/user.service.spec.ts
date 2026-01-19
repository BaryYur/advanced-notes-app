import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service";
import { DatabaseService } from "../database";
import { UserAuthType } from "@prisma/client";

describe("UserService", () => {
  let service: UserService;
  let database: DatabaseService;

  const mockDatabaseService = {
    user: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
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
    database = module.get<DatabaseService>(DatabaseService);
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
});
