import { SignInDto, SignUpDto, ResetPasswordDto, SendResetPasswordVerificationCodeDto } from "./dto";
import { AuthService } from "./auth.service";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signIn(signInUserDto: SignInDto): Promise<{
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
    signUp(signUpUserDto: SignUpDto): Promise<{
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
    sendResetPasswordCode(dto: SendResetPasswordVerificationCodeDto): Promise<Partial<{
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
}
