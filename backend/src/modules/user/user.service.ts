import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common";

import { Prisma, User, UserAuthType } from "@prisma/client";

import { DatabaseService } from "../database";

import { UpdateUserDto, UpdatePasswordDto } from "./dto";

import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
  constructor(private database: DatabaseService) {}

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.database.user.create({ data });
  }

  async findUserByEmail(
    email: string,
    authType: UserAuthType,
  ): Promise<User | null> {
    return this.database.user.findFirst({
      where: { email, authType },
    });
  }

  async findUserById(id: string): Promise<User | null> {
    return this.database.user.findUnique({ where: { id } });
  }

  async updateUserInfo(id: string, dto: UpdateUserDto): Promise<User> {
    return this.database.user.update({
      where: { id },
      data: { ...dto },
    });
  }

  async changePassword(id: string, dto: UpdatePasswordDto): Promise<User> {
    const user = await this.findUserById(id);

    if (!user) throw new NotFoundException("User not found");

    if (!user.password) {
      throw new ForbiddenException("User does not have a password");
    }

    const match = await bcrypt.compare(dto.oldPassword, user.password);

    if (!match) {
      throw new ForbiddenException("Invalid old password");
    }

    const hashed = await bcrypt.hash(dto.newPassword, 10);

    return this.database.user.update({
      where: { id },
      data: { password: hashed },
    });
  }

  async deleteUser(id: string): Promise<void> {
    await this.database.user.delete({ where: { id } });
  }
}
