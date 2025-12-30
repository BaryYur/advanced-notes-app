import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { WsException } from "@nestjs/websockets";
import { Socket } from "socket.io";
import * as cookie from "cookie";
import { UserService } from "../user/user.service";

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const client: Socket = context.switchToWs().getClient();

      const rawCookies = client.handshake.headers.cookie;
      if (!rawCookies) {
        throw new WsException("Cookies not found");
      }

      const parsedCookies = cookie.parse(rawCookies);
      const accessToken = parsedCookies["accessToken"];

      if (!accessToken) {
        throw new WsException("Access token not found in cookies");
      }

      const payload = await this.jwtService.verifyAsync(accessToken, {
        secret: this.configService.get("JWT_SECRET"),
      });

      const user = await this.userService.findUserById(payload.sub);
      if (!user) {
        throw new WsException("User not found");
      }

      const { password, ...rest } = user;
      client["user"] = rest;

      return true;
    } catch (err) {
      throw new WsException("Unauthorized");
    }
  }
}
