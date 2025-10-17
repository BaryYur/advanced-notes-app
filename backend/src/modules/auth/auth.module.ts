import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserService } from "../user/user.service";

import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { TokenService } from "./token.service";
import { MailService } from "../mail/mail.service";
import { CryptoUtil } from "../../common/utils/crypto.util";

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get("JWT_SECRET"),
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, TokenService, MailService, CryptoUtil],
  exports: [TokenService],
})
export class AuthModule {}
