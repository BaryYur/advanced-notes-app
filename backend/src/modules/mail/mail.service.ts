import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import * as nodemailer from "nodemailer";

const configService = new ConfigService();

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: configService.get("MAIL_HOST"),
      secure: true,
      port: 465,
      auth: {
        user: configService.get("MAIL_USER"),
        pass: configService.get("MAIL_PASS"),
      },
    });
  }

  async sendResetCode(to: string, resetCode: number) {
    try {
      const mailOptions = {
        from: "Bary from Notes App",
        to,
        subject: "Reset password code from Notes App",
        text: `Verification code: ${resetCode}`,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      throw error;
    }
  }
}
