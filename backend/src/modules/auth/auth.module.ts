import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserService } from "../user/user.service";

import { TokenService } from "./token.service";
import { MailService } from "../mail/mail.service";
import { CryptoUtil } from "../../common/utils/crypto.util";

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
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
