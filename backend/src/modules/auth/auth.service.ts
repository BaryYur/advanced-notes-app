import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { User, UserAuthType } from "@prisma/client";

import { UserService } from "../user/user.service";
import { MailService } from "../mail/mail.service";

import {
  SignUpDto,
  SignInDto,
  ResetPasswordCodeDto,
  ResetPasswordDto,
} from "./dto";

import * as bcrypt from "bcrypt";
import { DatabaseService } from "../database";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private database: DatabaseService,
    private mailService: MailService,
  ) {}

  private SALT_ROUNDS = 10;

  async signUp(dto: SignUpDto) {
    const isUserExist = await this.userService.findUserByEmail(
      dto.email,
      dto.authType,
    );

    if (isUserExist) {
      throw new BadRequestException("User with this email already exists");
    }

    let hashed;

    if (dto.password && dto.authType === UserAuthType.email) {
      hashed = await bcrypt.hash(dto.password, this.SALT_ROUNDS);
    }

    const user = await this.userService.createUser({
      email: dto.email,
      password: hashed ?? null,
      firstName: dto.firstName,
      lastName: dto.lastName,
      authType: dto.authType,
    });

    const token = this.generateToken(user);

    return { user: this.sanitizeUser(user), accessToken: token };
  }

  async signIn(dto: SignInDto) {
    const user = await this.userService.findUserByEmail(
      dto.email,
      dto.authType,
    );

    if (!user) throw new UnauthorizedException("Invalid credentials");

    if (dto.authType === UserAuthType.email && dto.password && user.password) {
      const match = await bcrypt.compare(dto.password, user.password);

      if (!match) throw new UnauthorizedException("Invalid password");
    }

    const token = this.generateToken(user);

    return { user: this.sanitizeUser(user), accessToken: token };
  }

  async getResetPasswordCode(dto: ResetPasswordCodeDto) {
    const user = await this.userService.findUserByEmail(
      dto.email,
      UserAuthType.email,
    );

    if (!user) {
      throw new NotFoundException("User with this email does not exist");
    }

    const resetCode = this.generateResetCode();

    await this.mailService.sendResetCode(dto.email, resetCode);

    await this.database.user.update({
      where: { id: user.id },
      data: {
        passwordResetCode: resetCode,
        passwordResetCodeExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
      },
    });
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.userService.findUserByEmail(
      dto.email,
      UserAuthType.email,
    );

    if (!user) {
      throw new NotFoundException("User with this email does not exist");
    }

    if (user.passwordResetCode && user.passwordResetCodeExpiresAt) {
      if (user.passwordResetCode !== dto.verificationCode) {
        throw new BadRequestException("Invalid verification code");
      }

      if (user.passwordResetCodeExpiresAt < new Date()) {
        throw new BadRequestException("Verification code has expired");
      }
    }

    await this.database.user.update({
      where: { id: user.id },
      data: { password: await bcrypt.hash(dto.newPassword, this.SALT_ROUNDS) },
    });
  }

  private generateToken(user: { id: string; email: string }) {
    const payload = { sub: user.id, email: user.email };

    return this.jwtService.sign(payload);
  }

  private sanitizeUser(user: User) {
    const { password, ...rest } = user;

    return rest;
  }

  private generateResetCode() {
    return Math.floor(100000 + Math.random() * 900000);
  }
}
