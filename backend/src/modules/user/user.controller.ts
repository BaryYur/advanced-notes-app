import { Controller, Get, UseGuards, Req } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from "@nestjs/swagger";

import { RequestWithUser } from "src/common/types";

import { UserService } from "./user.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { UserDto } from "./dto/user.dto";

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
}
