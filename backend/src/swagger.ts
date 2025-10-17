import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { INestApplication } from "@nestjs/common";

import { SchemaObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";

export function setupSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle("Advanced notes app server")
    .setDescription("Advanced notes app server API documentation")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup("/api/v1", app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: "Advanced notes app server",
    customJs: [
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js",
    ],
    customCssUrl: [
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css",
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.css",
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.css",
    ],
  });
}

export function createErrorResponseSchema(): SchemaObject {
  return {
    type: "object",
    properties: {
      message: { type: "string", example: "Forbidden" },
      statusCode: { type: "number", example: 403 },
      error: { type: "string", example: "Forbidden" },
    },
  };
}
