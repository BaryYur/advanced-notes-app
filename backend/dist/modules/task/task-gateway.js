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
exports.TaskGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const task_service_1 = require("./task.service");
const task_list_service_1 = require("./../task-list/task-list.service");
const update_tasks_indexes_dto_1 = require("./dto/update-tasks-indexes-dto");
let TaskGateway = class TaskGateway {
    constructor(taskService, taskListService) {
        this.taskService = taskService;
        this.taskListService = taskListService;
    }
    async createTaskList(createTaskDto) {
        const task = await this.taskService.create(createTaskDto);
        this.server.emit("taskCreated", task);
        const taskLists = await this.taskListService.findTaskListsByUserId(createTaskDto.task.userId);
        this.server.emit("taskListsByUserId", taskLists);
        const tasks = await this.taskService.findAllUserTasks(createTaskDto.task.userId);
        return { event: "userHomeTasks", data: tasks };
    }
    async getListTasks(taskListId) {
        const tasks = await this.taskService.findByTaskListId(taskListId);
        const orderedTasks = tasks.sort((a, b) => a.defaultIndex - b.defaultIndex);
        return { event: "userListTasks", data: orderedTasks };
    }
    async getHomeTasks(userId) {
        const tasks = await this.taskService.getHomeTasks(userId);
        return { event: "userHomeTasks", data: tasks };
    }
    async updateTaskIndexes(updateTasksIndexesDto) {
        const tasks = await this.taskService.updateTasksIndexes(updateTasksIndexesDto);
        return { event: "taskIndexesUpdated", data: tasks };
    }
    async updateTask(updateDto) {
        await this.taskService.updateTask(updateDto.id, updateDto.task);
        const task = await this.taskService.findOneTask(updateDto.id);
        const taskLists = await this.taskListService.findTaskListsByUserId(task.userId);
        this.server.emit("taskListsByUserId", taskLists);
        this.server.emit("taskUpdated", task);
        const homeTasks = await this.taskService.getHomeTasks(task.userId);
        this.server.emit("userHomeTasks", homeTasks);
        const completedTasks = await this.taskService.getCompletedTasks(task.userId);
        this.server.emit("userCompletedTasks", completedTasks);
        const listTasks = await this.taskService.findByTaskListId(task.taskListId);
        const orderedTasks = listTasks.sort((a, b) => a.defaultIndex - b.defaultIndex);
        return { event: "userListTasks", data: orderedTasks };
    }
    async getCompletedTasksByUserId(userId) {
        const taskLists = await this.taskService.getCompletedTasks(userId);
        return { event: "userCompletedTasks", data: taskLists };
    }
    async removeAllTasks(removeAllTasksDto) {
        await this.taskService.removeAllTasks(removeAllTasksDto);
    }
    async removeTask(removeTaskDto) {
        const task = await this.taskService.findOneTask(removeTaskDto.id);
        await this.taskService.removeTask(removeTaskDto.id);
        const homeTasks = await this.taskService.getHomeTasks(task.userId);
        this.server.emit("userHomeTasks", homeTasks);
        const completedTasks = await this.taskService.getCompletedTasks(task.userId);
        this.server.emit("userCompletedTasks", completedTasks);
        const listTasks = await this.taskService.findByTaskListId(task.taskListId);
        const orderedTasks = listTasks.sort((a, b) => a.defaultIndex - b.defaultIndex);
        const taskListsByUserId = await this.taskListService.findTaskListsByUserId(task.userId);
        console.log(taskListsByUserId, "by user");
        this.server.emit("taskListsByUserId", taskListsByUserId);
        return { event: "userListTasks", data: orderedTasks };
    }
};
exports.TaskGateway = TaskGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], TaskGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)("createTask"),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TaskGateway.prototype, "createTaskList", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("getListTasks"),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TaskGateway.prototype, "getListTasks", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("getHomeTasks"),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TaskGateway.prototype, "getHomeTasks", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("updateTaskIndexes"),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_tasks_indexes_dto_1.UpdateTasksIndexesDto]),
    __metadata("design:returntype", Promise)
], TaskGateway.prototype, "updateTaskIndexes", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("updateTask"),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TaskGateway.prototype, "updateTask", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("getCompletedTasks"),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TaskGateway.prototype, "getCompletedTasksByUserId", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("removeAllTasks"),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TaskGateway.prototype, "removeAllTasks", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("removeTask"),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TaskGateway.prototype, "removeTask", null);
exports.TaskGateway = TaskGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(4001, {
        cors: {
            origin: "*",
        },
    }),
    __metadata("design:paramtypes", [task_service_1.TaskService,
        task_list_service_1.TaskListService])
], TaskGateway);
//# sourceMappingURL=task-gateway.js.map