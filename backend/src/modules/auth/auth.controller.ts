import { Post, Controller, Body, Res } from "@nestjs/common";
import { Response } from "express";

import {
  SignInDto,
  SignUpDto,
  ResetPasswordCodeDto,
  ResetPasswordDto,
} from "./dto";

import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  public constructor(private readonly authService: AuthService) {}

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

  @Post("/logout")
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie("accessToken", {
      path: "/",
    });

    return { success: true };
  }

  @Post("/reset-password-code")
  async getResetPasswordCode(@Body() dto: ResetPasswordCodeDto) {
    return this.authService.getResetPasswordCode(dto);
  }

  @Post("/reset-password")
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }
}
