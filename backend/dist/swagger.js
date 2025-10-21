"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = setupSwagger;
exports.createErrorResponseSchema = createErrorResponseSchema;
const swagger_1 = require("@nestjs/swagger");
function setupSwagger(app) {
    const options = new swagger_1.DocumentBuilder()
        .setTitle("Advanced notes app server")
        .setDescription("Advanced notes app server API documentation")
        .setVersion("1.0")
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, options);
    swagger_1.SwaggerModule.setup("/api/v1", app, document, {
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
function createErrorResponseSchema() {
    return {
        type: "object",
        properties: {
            message: { type: "string", example: "Forbidden" },
            statusCode: { type: "number", example: 403 },
            error: { type: "string", example: "Forbidden" },
        },
    };
}
//# sourceMappingURL=swagger.js.map