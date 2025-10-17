import { Get, Body, Param, Controller, Patch } from "@nestjs/common";

import { UserService } from "./user.service";
import { UpdateUserDto } from "./dto/update-user.dto";

import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from "@nestjs/swagger";

@ApiTags("Users")
@Controller()
export class UserController {
  public constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: "Update user by id" })
  @ApiBody({ type: UpdateUserDto })
  @ApiBearerAuth()
  @Patch("/user/:id")
  public async updateById(
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUserById(id, updateUserDto);
  }

  @ApiOperation({ summary: "Get user by id" })
  @ApiBearerAuth()
  @Get("/user/:id")
  public async getById(
    @Param("id") id: string,
    // @Req() req: UserRequest,
  ) {
    return this.userService.findUserById(id);
  }
}
