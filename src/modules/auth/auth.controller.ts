import { Body, Controller, Get, Param, Patch, Post, Query, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ResponseSignUpDto, SignInDto, SignUpDto, UpdatePasswordDto, UpdatePasswordRequestDto, VerifyOtpDto } from "./auth.dto";
import { User } from "../users/users.entity";
import { Request } from "express";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post("sign-up")
  async signup(@Body() signupDto: SignUpDto): Promise<ResponseSignUpDto> {
    return await this.authService.signup(signupDto);
  }

  @Post("sign-in")
  async signin(@Body() signinDto: { email: string; password: string }): Promise<any> {
    return await this.authService.signin(signinDto);
  }

  @Post('update-password-request/:email')
  async updatePasswordRequest(@Param() updatePasswordReqDto: UpdatePasswordRequestDto): Promise<{ message: string }> {
    return await this.authService.updatePasswordRequest(updatePasswordReqDto);
  }

  @Post('verify-otp/:email/:otp')
  async verifyOtp(@Param() verifyOtpDto: VerifyOtpDto): Promise<{ message: string }> {
    return await this.authService.verifyOtp(verifyOtpDto);
  }

  @Patch('update-password')
  async updatePassword(@Body() updatePasswordDto: UpdatePasswordDto): Promise<User> {
    return await this.authService.updatePassword(updatePasswordDto);
  }
}
