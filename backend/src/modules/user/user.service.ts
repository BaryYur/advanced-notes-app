import { Injectable } from "@nestjs/common";

import { Prisma, User, UserAuthType } from "@prisma/client";

import { DatabaseService } from "../database";

import { UpdateUserDto } from "./dto";

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

  async deleteUser(id: string): Promise<void> {
    await this.database.user.delete({ where: { id } });
  }
}
