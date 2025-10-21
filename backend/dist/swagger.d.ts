import { INestApplication } from "@nestjs/common";
import { SchemaObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";
export declare function setupSwagger(app: INestApplication): void;
export declare function createErrorResponseSchema(): SchemaObject;
