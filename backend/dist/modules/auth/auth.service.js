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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const user_service_1 = require("../user/user.service");
const token_service_1 = require("./token.service");
const mail_service_1 = require("../mail/mail.service");
const crypto_1 = require("crypto");
let AuthService = class AuthService {
    constructor(userService, tokenService, mailService) {
        this.userService = userService;
        this.tokenService = tokenService;
        this.mailService = mailService;
    }
    async signUp(signUpDto) {
        const { firstName, lastName, email, password, authType } = signUpDto;
        const existingUser = await this.userService.findUserByEmail(email, authType);
        if (existingUser) {
            throw new common_1.ConflictException("User with this email already exists");
        }
        const hashedPassword = this.hashPassword(password);
        const newUser = await this.userService.createUser({
            firstName,
            lastName,
            email,
            authType,
            password: hashedPassword,
        });
        const tokens = await this.tokenService.generateTokens({
            sub: newUser.id,
        });
        await this.tokenService.updateRefreshToken(newUser.id, tokens.refreshToken);
        delete newUser.password;
        delete newUser.refreshToken;
        return {
            ...newUser,
            ...tokens,
        };
    }
    async signIn(signInDto) {
        const { email, password, authType } = signInDto;
        const user = await this.userService.findUserByEmail(email, authType);
        if (!user) {
            throw new common_1.NotFoundException("User not found");
        }
        if (user.authType === email &&
            !this.isPasswordValid(password, user.password)) {
            throw new common_1.UnauthorizedException("Invalid password");
        }
        const tokens = await this.tokenService.generateTokens({
            sub: user.id,
        });
        await this.tokenService.updateRefreshToken(user.id, tokens.refreshToken);
        delete user.password;
        delete user.refreshToken;
        return {
            ...user,
            ...tokens,
        };
    }
    async sendResetPasswordVerificationCode(email) {
        const user = await this.userService.findUserByEmail(email, client_1.UserAuthType.email);
        if (!user) {
            throw new common_1.NotFoundException("User does not exist or does not use email authentication");
        }
        const passwordResetCode = Math.floor(100000 + Math.random() * 900000);
        const passwordResetCodeExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
        await this.userService.updateUserById(user.id, {
            passwordResetCode,
            passwordResetCodeExpiresAt,
        });
        await this.mailService.sendResetCode(user.email, passwordResetCode);
        return user;
    }
    async resetPassword(resetPasswordDto) {
        const user = await this.userService.findUserByEmail(resetPasswordDto.email, client_1.UserAuthType.email);
        if (resetPasswordDto.verificationCode !== user.passwordResetCode) {
            throw new common_1.NotFoundException("Verification code is not correct");
        }
        if (user.passwordResetCodeExpiresAt < new Date()) {
            throw new common_1.NotFoundException("Verification code has expired");
        }
        if (resetPasswordDto.verificationCode === user.passwordResetCode &&
            user.passwordResetCodeExpiresAt > new Date()) {
            const hashedNewPassword = this.hashPassword(resetPasswordDto.newPassword);
            await this.userService.updateUserById(user.id, {
                password: hashedNewPassword,
            });
        }
        return user;
    }
    hashPassword(password) {
        return (0, crypto_1.createHash)("sha256").update(password).digest("hex");
    }
    isPasswordValid(password, hashedPassword) {
        const hash = this.hashPassword(password);
        return hash === hashedPassword;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        token_service_1.TokenService,
        mail_service_1.MailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map