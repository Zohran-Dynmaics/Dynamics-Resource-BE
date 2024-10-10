import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import {
  ResponseSignUpDto,
  SignInDto,
  SignUpDto,
  UpdatePasswordDto,
  UpdatePasswordRequestDto,
  VerifyOtpDto
} from "./auth.dto";
import { User } from "../admin/users/users.entity";
import { Response } from "express";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get("azure-auth")
  async azureAuth(@Req() query: Request, @Res() res: Response): Promise<any> {
    return res.redirect("https://www.google.com");
  }

  @Post("sign-in")
  async signin(@Body() signinDto: SignInDto): Promise<any> {
    return await this.authService.signin(signinDto);
  }

  @Post("sign-up")
  async signup(@Body() signupDto: SignUpDto): Promise<ResponseSignUpDto> {
    return await this.authService.signup(signupDto);
  }

  @Post("update-password-request/:email")
  async updatePasswordRequest(
    @Param() updatePasswordReqDto: UpdatePasswordRequestDto
  ): Promise<{ message: string }> {
    return await this.authService.updatePasswordRequest(updatePasswordReqDto);
  }

  @Post("verify-otp/:email/:otp")
  async verifyOtp(
    @Param() verifyOtpDto: VerifyOtpDto
  ): Promise<{ message: string }> {
    return await this.authService.verifyOtp(verifyOtpDto);
  }

  @Patch("update-password")
  async updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto
  ): Promise<User> {
    return await this.authService.updatePassword(updatePasswordDto);
  }
}
