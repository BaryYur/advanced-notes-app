import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe } from "@nestjs/common";

import { HttpExceptionFilter } from "./common/filters";
import { documentation } from "./common/config";

import { AppModule } from "./app.module";

import cookieParser from "cookie-parser";

async function bootstrap() {
  const configService = new ConfigService();

  const PORT = configService.get("SERVER_PORT") || 4000;

  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.enableCors({
    origin: [configService.get("FRONTEND_URL"), "http://localhost:5173"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
  });
  app.setGlobalPrefix("api");
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      errorHttpStatusCode: 400,
    }),
  );

  documentation(app);

  await app.listen(PORT);
}
bootstrap();
