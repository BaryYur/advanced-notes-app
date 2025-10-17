import { Body, Controller, Post } from "@nestjs/common";

import {
  SignInDto,
  SignUpDto,
  ResetPasswordDto,
  SendResetPasswordVerificationCodeDto,
} from "./dto";

import { AuthService } from "./auth.service";

import { ApiOperation, ApiTags, ApiBody, ApiResponse } from "@nestjs/swagger";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  public constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: "Sign in" })
  @ApiBody({ type: SignInDto })
  @ApiResponse({
    status: 201,
    example: {
      accessToken:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.Z3Z8_XMk-4RhE6di7tU6p3CZ0L8l6rAptNh-G0o9KOI",
      refreshToken:
        "4f8e9bc9c0e52d31f9e421db53e3f8b85f9a91b7e1d2cf707b558a9f4debbf82",
      id: "abc123",
      firstName: "John",
      lastName: "Doe",
      authType: "email",
      email: "john.doe@example.com",
      password: "hashed_password_example",
      passwordResetCode: "a1b2c3d4",
      passwordResetCodeExpiresAt: new Date().toISOString(),
    },
  })
  @Post("/sign-in")
  public async signIn(@Body() signInUserDto: SignInDto) {
    return this.authService.signIn(signInUserDto);
  }

  @ApiOperation({ summary: "Sign up" })
  @ApiBody({ type: SignUpDto })
  @ApiResponse({
    status: 201,
    example: {
      accessToken:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.Z3Z8_XMk-4RhE6di7tU6p3CZ0L8l6rAptNh-G0o9KOI",
      refreshToken:
        "4f8e9bc9c0e52d31f9e421db53e3f8b85f9a91b7e1d2cf707b558a9f4debbf82",
      id: "abc123",
      firstName: "John",
      lastName: "Doe",
      authType: "email",
      email: "john.doe@example.com",
      password: "hashed_password_example",
      passwordResetCode: "a1b2c3d4",
      passwordResetCodeExpiresAt: new Date().toISOString(),
    },
  })
  @Post("/sign-up")
  public async signUp(@Body() signUpUserDto: SignUpDto) {
    return this.authService.signUp(signUpUserDto);
  }

  @ApiOperation({ summary: "Send verification code for reset password" })
  @ApiBody({ type: SendResetPasswordVerificationCodeDto })
  @Post("/reset-password-code")
  public async sendResetPasswordCode(
    @Body() dto: SendResetPasswordVerificationCodeDto,
  ) {
    return this.authService.sendResetPasswordVerificationCode(dto.email);
  }

  @ApiOperation({ summary: "Reset password" })
  @ApiBody({ type: ResetPasswordDto })
  @Post("/reset-password")
  public async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
