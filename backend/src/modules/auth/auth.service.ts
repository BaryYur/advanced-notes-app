import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { User } from "@prisma/client";

import { UserService } from "../user/user.service";

import { SignUpDto, SignInDto } from "./dto";

import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
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

    if (dto.password && dto.authType === "email") {
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

    if (dto.authType === "email" && dto.password && user.password) {
      const match = await bcrypt.compare(dto.password, user.password);

      if (!match) throw new UnauthorizedException("Invalid password");
    }

    const token = this.generateToken(user);

    return { user: this.sanitizeUser(user), accessToken: token };
  }

  private generateToken(user: { id: string; email: string }) {
    const payload = { sub: user.id, email: user.email };

    return this.jwtService.sign(payload);
  }

  private sanitizeUser(user: User) {
    const { password, ...rest } = user;

    return rest;
  }
}
