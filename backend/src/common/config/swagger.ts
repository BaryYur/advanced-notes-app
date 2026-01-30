import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import basicAuth from "express-basic-auth";

import { HeaderAuthKey } from "../constants";

export const documentation = (app: INestApplication) => {
  const path = "/api/docs";
  const user = process.env.SWAGGER_USER;
  const password = process.env.SWAGGER_PASSWORD;

  if (process.env.NODE_ENV === "production" && user) {
    app.use(
      [path],
      basicAuth({
        users: {
          [user]: password || "",
        },
        challenge: true,
        unauthorizedResponse: "Unauthorized",
      }),
    );
  }

  const options = new DocumentBuilder()
    .setTitle("Advanced Notes App API")
    .setDescription(
      "The documentation for the Advanced Notes App backend API. Includes authentication, user management, and task operations.",
    )
    .setVersion("1.0.0")
    .addCookieAuth("accessToken", {
      type: "apiKey",
      in: "cookie",
      name: "accessToken",
      description: "Access token stored in cookies",
    })
    .addApiKey(
      {
        type: "apiKey",
        in: "header",
        name: HeaderAuthKey,
      },
      HeaderAuthKey,
    )
    .build();

  const baseDocument = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup(path, app, baseDocument, {
    swaggerOptions: {
      docExpansion: "none",
      displayRequestDuration: true,
      operationSorter: "alpha",
      tagsSorter: "alpha",
      defaultModelsExpandDepth: 2,
      defaultModelExpandDepth: 2,
      persistAuthorization: true,
    },
    customCssUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css",
    customJs: [
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js",
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js",
    ],
  });
};
