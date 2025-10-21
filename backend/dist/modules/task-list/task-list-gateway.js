"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskListGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const task_list_service_1 = require("./task-list.service");
const create_task_list_dto_1 = require("./dto/create-task-list-dto");
let TaskListGateway = class TaskListGateway {
    constructor(taskListService) {
        this.taskListService = taskListService;
    }
    async getTaskList(getTaskListDto) {
        const taskList = await this.taskListService.findTaskList(getTaskListDto.userId, getTaskListDto.name);
        this.server.emit("taskListFetched", taskList);
    }
    async createTaskList(createTaskListDto) {
        const taskList = await this.taskListService.createTaskList(createTaskListDto);
        this.server.emit("taskListCreated", taskList);
    }
    async updateTaskList(updateTaskListDto) {
        if (updateTaskListDto.taskListId) {
            const taskList = await this.taskListService.updateTaskList(updateTaskListDto.taskListId, updateTaskListDto.data);
            this.server.emit("taskListUpdated", taskList);
        }
    }
    async getTaskListsByUserId(userId) {
        const taskLists = await this.taskListService.findTaskListsByUserId(userId);
        return { event: "taskListsByUserId", data: taskLists };
    }
    async deleteTaskList(id) {
        await this.taskListService.deleteTaskList(id);
        this.server.emit("taskListDeleted", id);
    }
    async deleteTaskListTasks(deleteDto) {
        await this.taskListService.deleteAllTaskListTasks(deleteDto);
    }
};
exports.TaskListGateway = TaskListGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], TaskListGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)("getTaskList"),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TaskListGateway.prototype, "getTaskList", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("createTaskList"),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_task_list_dto_1.CreateTaskListDto]),
    __metadata("design:returntype", Promise)
], TaskListGateway.prototype, "createTaskList", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("updateTaskList"),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TaskListGateway.prototype, "updateTaskList", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("getTaskListsByUserId"),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TaskListGateway.prototype, "getTaskListsByUserId", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("deleteTaskList"),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TaskListGateway.prototype, "deleteTaskList", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("deleteAllListTasks"),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TaskListGateway.prototype, "deleteTaskListTasks", null);
exports.TaskListGateway = TaskListGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(4001, {
        cors: {
            origin: "*",
        },
    }),
    __metadata("design:paramtypes", [task_list_service_1.TaskListService])
], TaskListGateway);
//# sourceMappingURL=task-list-gateway.js.map