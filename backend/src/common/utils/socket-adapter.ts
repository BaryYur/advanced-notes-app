import { ConfigService } from "@nestjs/config";
import { INestApplicationContext } from "@nestjs/common";

import { IoAdapter } from "@nestjs/platform-socket.io";
import { ServerOptions } from "socket.io";

export class SocketIoAdapter extends IoAdapter {
  constructor(private app: INestApplicationContext) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions) {
    const configService = this.app.get(ConfigService);
    const frontendUrl = configService.get("FRONTEND_DOMAIN");

    const optionsWithCORS = {
      ...options,
      cors: {
        origin: [frontendUrl, "http://localhost:5173"],
        credentials: true,
      },
    };

    return super.createIOServer(port, optionsWithCORS);
  }
}
