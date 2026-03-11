import {
  Controller,
  Get,
  Patch,
  Delete,
  UseGuards,
  Body,
  Req,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiBody,
} from "@nestjs/swagger";
import { RequestWithUser } from "../../common/types";

import { UserService } from "./user.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { UserDto, UpdateUserDto, UpdatePasswordDto } from "./dto";

@ApiTags("User")
@Controller("user")
export class UserController {
  constructor(private userService: UserService) {}

  @ApiBearerAuth("accessToken")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get currently authenticated user information" })
  @ApiResponse({
    status: 200,
    description: "Returns the user information",
    type: UserDto,
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @Get("/info")
  public async getUserInfo(@Req() req: RequestWithUser) {
    return this.userService.findUserById(req.user.id);
  }

  @ApiBearerAuth("accessToken")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Update currently authenticated user information" })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: "Returns the updated user information",
    type: UserDto,
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @Patch("/info")
  public async updateUserInfo(
    @Req() req: RequestWithUser,
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.updateUserInfo(req.user.id, dto);
  }

  @ApiBearerAuth("accessToken")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Change currently authenticated user password" })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: "Returns the updated user information",
    type: UserDto,
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @Patch("/password")
  public async changePassword(
    @Req() req: RequestWithUser,
    @Body() dto: UpdatePasswordDto,
  ) {
    return this.userService.changePassword(req.user.id, dto);
  }

  @ApiBearerAuth("accessToken")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Delete currently authenticated user" })
  @ApiResponse({ status: 200, description: "User deleted successfully" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @Delete()
  public async deleteUser(@Req() req: RequestWithUser): Promise<void> {
    return this.userService.deleteUser(req.user.id);
  }
}
