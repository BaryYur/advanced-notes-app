import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { MailService } from "./mail.service";
import * as nodemailer from "nodemailer";

jest.mock("nodemailer");
jest.mock("fs");
jest.mock("mjml", () => jest.fn(() => ({ html: "<html></html>" })));

describe("MailService", () => {
  let service: MailService;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === "MAIL_HOST") return "smtp.test.com";
      if (key === "MAIL_USER") return "test@test.com";
      if (key === "MAIL_PASS") return "pass";
      return null;
    }),
  };

  const mockTransporter = {
    sendMail: jest.fn().mockResolvedValue({}),
  };

  beforeEach(async () => {
    (nodemailer.createTransport as jest.Mock).mockReturnValue(mockTransporter);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("sendResetCode", () => {
    it("should call transporter.sendMail", async () => {
      // Mock renderTemplate internal call or its dependencies
      jest
        .spyOn(service as any, "renderTemplate")
        .mockReturnValue("<html></html>");

      await service.sendResetCode("user@test.com", 123456);

      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: "user@test.com",
          subject: "Reset password code from Notes App",
          html: "<html></html>",
        }),
      );
    });
  });
});
