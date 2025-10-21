import { ResetPasswordDto } from "./dto/reset-password-dto";
import { UserService } from "../user/user.service";
import { TokenService } from "./token.service";
import { MailService } from "../mail/mail.service";
import { SignInDto, SignUpDto } from "./dto/auth-user-dto";
export declare class AuthService {
    private readonly userService;
    private readonly tokenService;
    private readonly mailService;
    constructor(userService: UserService, tokenService: TokenService, mailService: MailService);
    signUp(signUpDto: SignUpDto): Promise<{
        accessToken: string;
        refreshToken: string;
        id: string;
        firstName: string;
        lastName: string;
        authType: import(".prisma/client").$Enums.UserAuthType;
        email: string;
        password: string;
        passwordResetCode: number | null;
        passwordResetCodeExpiresAt: Date | null;
    }>;
    signIn(signInDto: SignInDto): Promise<{
        accessToken: string;
        refreshToken: string;
        id?: string;
        firstName?: string;
        lastName?: string;
        authType?: import(".prisma/client").$Enums.UserAuthType;
        email?: string;
        password?: string;
        passwordResetCode?: number | null;
        passwordResetCodeExpiresAt?: Date | null;
    }>;
    sendResetPasswordVerificationCode(email: string): Promise<Partial<{
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
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<Partial<{
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
    private hashPassword;
    private isPasswordValid;
}
