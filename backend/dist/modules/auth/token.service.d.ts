import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "../../common/types/interfaces/jwt-payload.interface";
import { CryptoUtil } from "../../common/utils/crypto.util";
import { UserService } from "../user/user.service";
export declare class TokenService {
    private readonly jwtService;
    private readonly configService;
    private readonly userService;
    private readonly cryptoUtil;
    constructor(jwtService: JwtService, configService: ConfigService, userService: UserService, cryptoUtil: CryptoUtil);
    generateTokens(payload: JwtPayload): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    updateRefreshToken(id: string, refreshToken: string): Promise<void>;
    validateAccessToken(token: string): Promise<JwtPayload>;
    validateRefreshToken(token: string): Promise<JwtPayload>;
}
