import { Body, Controller, Get, Patch, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ResponseSignUpDto, SignInDto, SignUpDto, UpdatePasswordDto } from "./auth.dto";
import { User } from "../users/users.entity";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post("sign-up")
  async signup(@Body() signupDto: SignUpDto): Promise<ResponseSignUpDto> {
    return await this.authService.signup(signupDto);
  }

  @Post("sign-in")
  async signin(
    @Body() signinDto: { email: string; password: string }
  ): Promise<any> {
    return await this.authService.signin(signinDto);
  }


  @Patch('update-password')
  async updatePassword(@Body() updatePasswordDto: UpdatePasswordDto): Promise<User> {
    return await this.authService.updatePassword(updatePasswordDto);
  }
}
