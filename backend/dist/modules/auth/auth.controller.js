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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const dto_1 = require("./dto");
const auth_service_1 = require("./auth.service");
const swagger_1 = require("@nestjs/swagger");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async signIn(signInUserDto) {
        return this.authService.signIn(signInUserDto);
    }
    async signUp(signUpUserDto) {
        return this.authService.signUp(signUpUserDto);
    }
    async sendResetPasswordCode(dto) {
        return this.authService.sendResetPasswordVerificationCode(dto.email);
    }
    async resetPassword(resetPasswordDto) {
        return this.authService.resetPassword(resetPasswordDto);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Sign in" }),
    (0, swagger_1.ApiBody)({ type: dto_1.SignInDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        example: {
            accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.Z3Z8_XMk-4RhE6di7tU6p3CZ0L8l6rAptNh-G0o9KOI",
            refreshToken: "4f8e9bc9c0e52d31f9e421db53e3f8b85f9a91b7e1d2cf707b558a9f4debbf82",
            id: "abc123",
            firstName: "John",
            lastName: "Doe",
            authType: "email",
            email: "john.doe@example.com",
            password: "hashed_password_example",
            passwordResetCode: "a1b2c3d4",
            passwordResetCodeExpiresAt: new Date().toISOString(),
        },
    }),
    (0, common_1.Post)("/sign-in"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.SignInDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signIn", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Sign up" }),
    (0, swagger_1.ApiBody)({ type: dto_1.SignUpDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        example: {
            accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.Z3Z8_XMk-4RhE6di7tU6p3CZ0L8l6rAptNh-G0o9KOI",
            refreshToken: "4f8e9bc9c0e52d31f9e421db53e3f8b85f9a91b7e1d2cf707b558a9f4debbf82",
            id: "abc123",
            firstName: "John",
            lastName: "Doe",
            authType: "email",
            email: "john.doe@example.com",
            password: "hashed_password_example",
            passwordResetCode: "a1b2c3d4",
            passwordResetCodeExpiresAt: new Date().toISOString(),
        },
    }),
    (0, common_1.Post)("/sign-up"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.SignUpDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signUp", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Send verification code for reset password" }),
    (0, swagger_1.ApiBody)({ type: dto_1.SendResetPasswordVerificationCodeDto }),
    (0, common_1.Post)("/reset-password-code"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.SendResetPasswordVerificationCodeDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "sendResetPasswordCode", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Reset password" }),
    (0, swagger_1.ApiBody)({ type: dto_1.ResetPasswordDto }),
    (0, common_1.Post)("/reset-password"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)("Authentication"),
    (0, common_1.Controller)("auth"),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map