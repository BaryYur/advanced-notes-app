import { CanActivate, ExecutionContext } from "@nestjs/common";
import { TokenService } from "../../modules/auth/token.service";
export declare class RefreshGuard implements CanActivate {
    private readonly tokenService;
    constructor(tokenService: TokenService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private extractTokenFromHeader;
}
