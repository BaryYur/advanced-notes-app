import { Post, Controller, Body, Res } from "@nestjs/common";
import { Response } from "express";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";

import {
  SignInDto,
  SignUpDto,
  ResetPasswordCodeDto,
  ResetPasswordDto,
} from "./dto";

import { AuthService } from "./auth.service";
import { SuccessResponseDto } from "src/common/dto/success.dto";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  public constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: "Register a new user" })
  @ApiResponse({
    status: 201,
    description: "User successfully registered",
    type: SuccessResponseDto,
  })
  @ApiResponse({ status: 400, description: "Invalid input data" })
  @Post("/sign-up")
  async signUp(
    @Body() dto: SignUpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken } = await this.authService.signUp(dto);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
      path: "/",
    });

    return { success: true };
  }

  @ApiOperation({ summary: "Login a user" })
  @ApiResponse({
    status: 200,
    description: "User successfully logged in",
    type: SuccessResponseDto,
  })
  @ApiResponse({ status: 401, description: "Invalid credentials" })
  @Post("/sign-in")
  async signIn(
    @Body() dto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken } = await this.authService.signIn(dto);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
      path: "/",
    });

    return { success: true };
  }

  @ApiOperation({ summary: "Logout a user" })
  @ApiResponse({
    status: 200,
    description: "User successfully logged out",
    type: SuccessResponseDto,
  })
  @Post("/logout")
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie("accessToken", {
      path: "/",
    });

    return { success: true };
  }

  @ApiOperation({ summary: "Send password reset code to email" })
  @ApiResponse({ status: 200, description: "Reset code sent successfully" })
  @ApiResponse({ status: 404, description: "User not found" })
  @Post("/reset-password/get-code")
  async getResetPasswordCode(@Body() dto: ResetPasswordCodeDto) {
    return this.authService.getResetPasswordCode(dto);
  }

  @ApiOperation({ summary: "Reset password using verification code" })
  @ApiResponse({ status: 200, description: "Password reset successfully" })
  @ApiResponse({ status: 400, description: "Invalid or expired code" })
  @Post("/reset-password")
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }
}
