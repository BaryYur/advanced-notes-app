import { NestMiddleware } from "@nestjs/common";
import { NextFunction, Request } from "express";
import { TokenService } from "../../modules/auth/token.service";
export declare class AuthMiddleware implements NestMiddleware {
    private readonly tokenService;
    constructor(tokenService: TokenService);
    use(request: Request, _response: Response, next: NextFunction): Promise<void>;
    private extractTokenFromHeader;
}
