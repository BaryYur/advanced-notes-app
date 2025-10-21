import { UserService } from "./user.service";
import { UpdateUserDto } from "./dto/update-user.dto";
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    updateById(id: string, updateUserDto: UpdateUserDto): Promise<Partial<{
        id: string;
        firstName: string;
        lastName: string;
        authType: import(".prisma/client").$Enums.UserAuthType;
        email: string;
        password: string;
        passwordResetCode: number | null;
        passwordResetCodeExpiresAt: Date | null;
        refreshToken: string | null;
    }>>;
    getById(id: string): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        authType: import(".prisma/client").$Enums.UserAuthType;
        email: string;
    }>;
}
