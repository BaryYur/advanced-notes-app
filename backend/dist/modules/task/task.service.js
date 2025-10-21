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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
const client_1 = require("@prisma/client");
let TaskService = class TaskService {
    constructor(database) {
        this.database = database;
    }
    async create(createTaskDto) {
        const tasks = await this.database.task.findMany({
            where: {
                userId: createTaskDto.task.userId,
            },
        });
        const updatedTasks = tasks.map((task, index) => ({
            index,
            ...task,
            homeIndex: task.homeIndex + 1,
        }));
        await this.updateTasksIndexes({
            listType: client_1.TaskListType.home,
            tasks: updatedTasks,
        });
        const task = await this.database.task.create({
            data: {
                ...createTaskDto.task,
            },
        });
        return task;
    }
    async updateTaskListId(taskId, taskListId) {
        const taskList = await this.database.taskList.findUnique({
            where: {
                id: taskListId,
            },
        });
        if (!taskList) {
            throw new common_1.NotFoundException("Task list not found");
        }
        await this.database.task.update({
            where: {
                id: taskId,
            },
            data: {
                taskListId,
            },
        });
    }
    async updateTasksIndexes(updateTasksIndexesDto) {
        const { tasks, listType } = updateTasksIndexesDto;
        const typeIndex = `${listType}Index`;
        const updatedTasks = await this.database.$transaction(tasks.map((update) => this.database.task.update({
            where: { id: update.id },
            data: {
                [typeIndex]: update.index,
            },
        })));
        return updatedTasks;
    }
    async findByTaskListId(id) {
        const tasks = await this.database.task.findMany({
            where: {
                taskListId: id,
                completed: false,
            },
            include: {
                taskList: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return tasks;
    }
    async findAllUserTasks(userId) {
        const tasks = await this.database.task.findMany({
            where: {
                userId,
            },
            include: {
                taskList: true,
            },
        });
        return tasks;
    }
    async findOneTask(id) {
        const task = await this.database.task.findUnique({
            where: {
                id,
            },
        });
        return task;
    }
    async updateTask(id, updateTaskDto) {
        await this.database.task.update({
            where: {
                id,
            },
            data: {
                ...updateTaskDto,
            },
        });
    }
    async removeTask(id) {
        await this.database.task.delete({
            where: {
                id,
            },
        });
    }
    async getHomeTasks(userId) {
        const tasks = await this.database.task.findMany({
            where: {
                userId,
                completed: false,
            },
            include: {
                taskList: true,
            },
        });
        tasks.sort((a, b) => a.homeIndex - b.homeIndex);
        return tasks;
    }
    async getTodayTasks(userId) { }
    async getCompletedTasks(userId) {
        const tasks = await this.database.task.findMany({
            where: {
                userId,
                completed: true,
            },
            include: {
                taskList: true,
            },
        });
        if (!tasks) {
            throw new common_1.NotFoundException("Tasks not found");
        }
        return tasks;
    }
    async removeAllTasks(removeAllTasksDto) {
        const { userId, listType } = removeAllTasksDto;
        const deleteHomeTasks = async () => {
            console.log("delete home");
            await this.database.task.deleteMany({
                where: {
                    userId,
                },
            });
        };
        switch (listType) {
            case client_1.TaskListType.home:
                await deleteHomeTasks();
                break;
            case client_1.TaskListType.today:
                console.log("today");
                break;
            case client_1.TaskListType.completed:
                console.log("completed");
                break;
            case client_1.TaskListType.default:
                console.log("def");
                break;
            default:
                throw new common_1.NotFoundException("List type is not correct");
        }
    }
};
exports.TaskService = TaskService;
exports.TaskService = TaskService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], TaskService);
//# sourceMappingURL=task.service.js.map