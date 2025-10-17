import { ResetPasswordDto } from "./dto/reset-password-dto";
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
} from "@nestjs/common";

import { UserAuthType } from "@prisma/client";

import { UserService } from "../user/user.service";
import { TokenService } from "./token.service";
import { MailService } from "../mail/mail.service";

import { SignInDto, SignUpDto } from "./dto/auth-user-dto";

import { createHash } from "crypto";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly mailService: MailService,
  ) {}

  public async signUp(signUpDto: SignUpDto) {
    const { firstName, lastName, email, password, authType } = signUpDto;

    const existingUser = await this.userService.findUserByEmail(
      email,
      authType,
    );

    if (existingUser) {
      throw new ConflictException("User with this email already exists");
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

  public async signIn(signInDto: SignInDto) {
    const { email, password, authType } = signInDto;

    const user = await this.userService.findUserByEmail(email, authType);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (
      user.authType === email &&
      !this.isPasswordValid(password, user.password)
    ) {
      throw new UnauthorizedException("Invalid password");
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

  public async sendResetPasswordVerificationCode(email: string) {
    const user = await this.userService.findUserByEmail(
      email,
      UserAuthType.email,
    );

    if (!user) {
      throw new NotFoundException(
        "User does not exist or does not use email authentication",
      );
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

  public async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.userService.findUserByEmail(
      resetPasswordDto.email,
      UserAuthType.email,
    );

    if (resetPasswordDto.verificationCode !== user.passwordResetCode) {
      throw new NotFoundException("Verification code is not correct");
    }

    if (user.passwordResetCodeExpiresAt < new Date()) {
      throw new NotFoundException("Verification code has expired");
    }

    if (
      resetPasswordDto.verificationCode === user.passwordResetCode &&
      user.passwordResetCodeExpiresAt > new Date()
    ) {
      const hashedNewPassword = this.hashPassword(resetPasswordDto.newPassword);

      await this.userService.updateUserById(user.id, {
        password: hashedNewPassword,
      });
    }

    return user;
  }

  private hashPassword(password: string): string {
    return createHash("sha256").update(password).digest("hex");
  }

  private isPasswordValid(password: string, hashedPassword: string): boolean {
    const hash = this.hashPassword(password);

    return hash === hashedPassword;
  }
}
