"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const admin = __importStar(require("firebase-admin"));
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const helmet_1 = __importDefault(require("helmet"));
const swagger_1 = require("./swagger");
const express_basic_auth_1 = __importDefault(require("express-basic-auth"));
async function bootstrap() {
    const configService = new config_1.ConfigService();
    const firebaseConfig = {
        projectId: configService.get("FIREBASE_PROJECT_ID"),
        clientEmail: configService.get("FIREBASE_CLIENT_EMAIL"),
        privateKey: configService.get("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n"),
        ignoreUndefinedProperties: true,
    };
    admin.initializeApp({
        credential: admin.credential.cert(firebaseConfig),
        databaseURL: `https://${firebaseConfig.projectId}.firebaseio.com`,
        storageBucket: `${firebaseConfig.projectId}.appspot.com`,
    });
    const PORT = configService.get("SERVER_PORT") || 4000;
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: [configService.get("FRONTEND_DOMAIN"), "http://localhost:5173"],
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    });
    app.setGlobalPrefix("api");
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        errorHttpStatusCode: 400,
    }));
    (0, swagger_1.setupSwagger)(app);
    app.use((0, helmet_1.default)());
    app.use(["/api/v1"], (0, express_basic_auth_1.default)({
        users: {
            [configService.get("ADMIN_NAME")]: configService.get("ADMIN_PASSWORD"),
        },
        challenge: true,
        unauthorizedResponse: "Unauthorized",
    }));
    await app.listen(PORT);
}
bootstrap();
//# sourceMappingURL=main.js.map