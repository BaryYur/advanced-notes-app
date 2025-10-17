import { Injectable, NotFoundException } from "@nestjs/common";

import { UserAuthType, Prisma, User } from "@prisma/client";
import { DatabaseService } from "../database/database.service";

@Injectable()
export class UserService {
  public constructor(private readonly database: DatabaseService) {}

  public async createUser(
    createUserDto: Prisma.UserCreateInput,
  ): Promise<User> {
    const user = await this.database.user.create({
      data: {
        ...createUserDto,
      },
    });

    return user;
  }

  public async findUserByEmail(
    email: string,
    authType: UserAuthType,
  ): Promise<Partial<User> | null> {
    const user = await this.database.user.findFirst({
      where: {
        email,
        authType,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        authType: true,
      },
    });

    return user;
  }

  public async findUserById(id: string) {
    const user = await this.database.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        authType: true,
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  public async updateUserById(
    id: string,
    updateUserDto: Prisma.UserUpdateInput,
  ): Promise<Partial<User> | null> {
    const user = await this.database.user.update({
      where: { id },
      data: { ...updateUserDto },
    });

    if (!user) {
      throw new NotFoundException("User is not found");
    }

    return user;
  }

  public async deleteUserById(id: string) {}
}
