import {
  MiddlewareConsumer,
  Module,
  RequestMethod,
  NestModule,
} from "@nestjs/common";

import { ConfigModule } from "@nestjs/config";

import { AuthMiddleware } from "./common/middlewares/auth.middleware";

import { DatabaseModule } from "./modules/database/database.module";
import { AuthModule } from "./modules/auth/auth.module";
import { UserModule } from "./modules/user/user.module";
import { ClassRoomModule } from "./modules/task-list/task-list.module";
import { MailModule } from "./modules/mail/mail.module";
import { TaskModule } from "./modules/task/task.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
    ClassRoomModule,
    MailModule,
    TaskModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude("user", {
        path: "/user",
        method: RequestMethod.POST,
      })
      .forRoutes("user", "task-list", "task");
  }
}
