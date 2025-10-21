import { UserAuthType } from "@prisma/client";
export declare class AuthUserDto {
    authType: UserAuthType;
}
export declare class SignInDto extends AuthUserDto {
    email: string;
    password: string;
}
export declare class SignUpDto extends SignInDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}
