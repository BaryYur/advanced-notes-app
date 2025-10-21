import { UserAuthType, Prisma, User } from "@prisma/client";
import { DatabaseService } from "../database/database.service";
export declare class UserService {
    private readonly database;
    constructor(database: DatabaseService);
    createUser(createUserDto: Prisma.UserCreateInput): Promise<User>;
    findUserByEmail(email: string, authType: UserAuthType): Promise<Partial<User> | null>;
    findUserById(id: string): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        authType: import(".prisma/client").$Enums.UserAuthType;
        email: string;
    }>;
    updateUserById(id: string, updateUserDto: Prisma.UserUpdateInput): Promise<Partial<User> | null>;
    deleteUserById(id: string): Promise<void>;
}
