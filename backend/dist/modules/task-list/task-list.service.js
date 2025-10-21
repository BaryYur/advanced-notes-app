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
exports.TaskListService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
let TaskListService = class TaskListService {
    constructor(database) {
        this.database = database;
    }
    async createTaskList(createTaskListDto) {
        const user = await this.database.user.findUnique({
            where: {
                id: createTaskListDto.userId,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException("User not found");
        }
        const taskList = await this.database.taskList.create({
            data: {
                ...createTaskListDto,
            },
        });
        return taskList;
    }
    async findTaskList(userId, name) {
        const taskList = await this.database.taskList.findFirst({
            where: {
                userId,
                name,
            },
        });
        if (!taskList) {
            throw new common_1.NotFoundException("Task list not found");
        }
        return taskList;
    }
    async findTaskListsByUserId(userId) {
        const taskLists = await this.database.taskList.findMany({
            where: {
                userId,
            },
            include: { tasks: true },
            orderBy: { createdAt: "asc" },
        });
        const lists = [];
        for (const list of taskLists) {
            const listItem = {
                ...list,
                tasksCounter: list.tasks.filter((task) => !task.completed).length,
            };
            lists.push(listItem);
        }
        return lists;
    }
    async updateTaskList(taskListId, updateTaskListDto) {
        const updatedTaskList = await this.database.taskList.update({
            where: {
                id: taskListId,
            },
            data: {
                ...updateTaskListDto,
            },
        });
        return updatedTaskList;
    }
    async deleteTaskList(id) {
        try {
            const deletedTaskList = await this.database.taskList.delete({
                where: {
                    id,
                },
            });
            return { message: "Task list deleted successfully", deletedTaskList };
        }
        catch (error) {
            throw new common_1.ConflictException("Task list not found or deletion failed");
        }
    }
    async deleteAllTaskListTasks(deleteDto) {
        try {
            switch (deleteDto.taskListType) {
                case "default":
                    await this.database.task.deleteMany({
                        where: {
                            taskListId: deleteDto.taskListId,
                        },
                    });
            }
        }
        catch (error) {
            throw new common_1.ConflictException("Task list not found or deletion failed");
        }
    }
};
exports.TaskListService = TaskListService;
exports.TaskListService = TaskListService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], TaskListService);
//# sourceMappingURL=task-list.service.js.map