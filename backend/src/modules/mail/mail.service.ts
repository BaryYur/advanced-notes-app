import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import * as nodemailer from "nodemailer";
import * as fs from "fs";
import * as path from "path";
import Handlebars from "handlebars";

const mjml2html = require("mjml");
@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private templateCache = new Map<string, Handlebars.TemplateDelegate>();

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get("MAIL_HOST"),
      port: 465,
      secure: true,
      auth: {
        user: this.configService.get("MAIL_USER"),
        pass: this.configService.get("MAIL_PASS"),
      },
    });
  }

  private renderTemplate(
    templateName: string,
    context: Record<string, any>,
  ): string {
    if (!this.templateCache.has(templateName)) {
      const templatePath = path.join(__dirname, "templates", templateName);

      const mjml = fs.readFileSync(templatePath, "utf8");
      this.templateCache.set(templateName, Handlebars.compile(mjml));
    }

    const template = this.templateCache.get(templateName)!;
    const mjmlWithData = template(context);

    const { html } = mjml2html(mjmlWithData);

    return html;
  }

  async sendResetCode(to: string, resetCode: number) {
    const html = this.renderTemplate("reset-code.mjml", { resetCode });

    await this.transporter.sendMail({
      from: `"Bary from Notes App" <${this.configService.get("MAIL_USER")}>`,
      to,
      subject: "Reset password code from Notes App",
      html,
    });
  }
}
