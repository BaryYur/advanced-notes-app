import { Injectable } from "@nestjs/common";

import { Prisma, User, UserAuthType } from "@prisma/client";

import { DatabaseService } from "../database";

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
}
