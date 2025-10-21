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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
let UserService = class UserService {
    constructor(database) {
        this.database = database;
    }
    async createUser(createUserDto) {
        const user = await this.database.user.create({
            data: {
                ...createUserDto,
            },
        });
        return user;
    }
    async findUserByEmail(email, authType) {
        const user = await this.database.user.findFirst({
            where: {
                email,
                authType,
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                authType: true,
            },
        });
        return user;
    }
    async findUserById(id) {
        const user = await this.database.user.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                authType: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException("User not found");
        }
        return user;
    }
    async updateUserById(id, updateUserDto) {
        const user = await this.database.user.update({
            where: { id },
            data: { ...updateUserDto },
        });
        if (!user) {
            throw new common_1.NotFoundException("User is not found");
        }
        return user;
    }
    async deleteUserById(id) { }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], UserService);
//# sourceMappingURL=user.service.js.map