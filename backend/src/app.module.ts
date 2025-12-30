import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { DatabaseModule } from "./modules/database";
import { AuthModule } from "./modules/auth/auth.module";
import { UserModule } from "./modules/user/user.module";
import { TaskModule } from "./modules/task/task.module";
import { TaskListModule } from "./modules/task-list/task-list.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UserModule,
    AuthModule,
    TaskModule,
    TaskListModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
