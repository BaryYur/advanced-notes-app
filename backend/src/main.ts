import * as admin from "firebase-admin";

import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";

import { ValidationPipe } from "@nestjs/common";

import { IoAdapter } from "@nestjs/platform-socket.io";
import { AppModule } from "./app.module";

import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import helmet from "helmet";

import { setupSwagger } from "./swagger";

import basicAuth from "express-basic-auth";

async function bootstrap() {
  const configService = new ConfigService();

  const firebaseConfig = {
    projectId: configService.get("FIREBASE_PROJECT_ID"),
    clientEmail: configService.get("FIREBASE_CLIENT_EMAIL"),
    privateKey: configService.get("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n"),
    ignoreUndefinedProperties: true,
  } as admin.ServiceAccount;

  admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig),
    databaseURL: `https://${firebaseConfig.projectId}.firebaseio.com`,
    storageBucket: `${firebaseConfig.projectId}.appspot.com`,
  });

  const PORT = configService.get("SERVER_PORT") || 4000;

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [configService.get("FRONTEND_DOMAIN"), "http://localhost:5173"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
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
  app.useWebSocketAdapter(new IoAdapter(app));

  setupSwagger(app);
  app.use(helmet());

  app.use(
    ["/api/v1"],
    basicAuth({
      users: {
        [configService.get("ADMIN_NAME")]: configService.get("ADMIN_PASSWORD"),
      },
      challenge: true,
      unauthorizedResponse: "Unauthorized",
    }),
  );

  await app.listen(PORT);
}

bootstrap();
