"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassRoomModule = void 0;
const common_1 = require("@nestjs/common");
const task_list_controller_1 = require("./task-list.controller");
const task_list_service_1 = require("./task-list.service");
const task_list_gateway_1 = require("./task-list-gateway");
let ClassRoomModule = class ClassRoomModule {
};
exports.ClassRoomModule = ClassRoomModule;
exports.ClassRoomModule = ClassRoomModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [task_list_controller_1.TaskListController],
        providers: [task_list_service_1.TaskListService, task_list_gateway_1.TaskListGateway],
        exports: [],
    })
], ClassRoomModule);
//# sourceMappingURL=task-list.module.js.map