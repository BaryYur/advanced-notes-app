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
exports.TokenService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const crypto_util_1 = require("../../common/utils/crypto.util");
const user_service_1 = require("../user/user.service");
let TokenService = class TokenService {
    constructor(jwtService, configService, userService, cryptoUtil) {
        this.jwtService = jwtService;
        this.configService = configService;
        this.userService = userService;
        this.cryptoUtil = cryptoUtil;
    }
    async generateTokens(payload) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.get("ACCESS_JWT_SECRET"),
                expiresIn: "10d",
            }),
            this.jwtService.signAsync(payload, {
                secret: this.configService.get("REFRESH_JWT_SECRET"),
                expiresIn: "20d",
            }),
        ]);
        return {
            accessToken,
            refreshToken,
        };
    }
    async updateRefreshToken(id, refreshToken) {
        const hashedRefreshToken = await this.cryptoUtil.encrypt(refreshToken);
        await this.userService.updateUserById(id, {
            refreshToken: hashedRefreshToken,
        });
    }
    async validateAccessToken(token) {
        return this.jwtService.verifyAsync(token, {
            secret: this.configService.get("ACCESS_JWT_SECRET"),
        });
    }
    async validateRefreshToken(token) {
        return this.jwtService.verifyAsync(token, {
            secret: this.configService.get("REFRESH_JWT_SECRET"),
        });
    }
};
exports.TokenService = TokenService;
exports.TokenService = TokenService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService,
        user_service_1.UserService,
        crypto_util_1.CryptoUtil])
], TokenService);
//# sourceMappingURL=token.service.js.map