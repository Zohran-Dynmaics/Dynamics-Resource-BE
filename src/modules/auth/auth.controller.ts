import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  Res
} from "@nestjs/common";
import { Response } from "express";
import { validatePhoneNumber } from "src/shared/utility/utility";
import { Customer } from "../customer/customer.entity";
import { CreateCustomer, CustomerLogin } from "../customer/dto";
import { User } from "../users/users.entity";
import {
  ResponseSignUpDto,
  SignInDto,
  SignUpDto,
  UpdatePassword,
  UpdatePasswordDto,
  UpdatePasswordRequest,
  UpdatePasswordRequestDto,
  VerifyOtp,
  VerifyOtpDto
} from "./auth.dto";
import { AuthService } from "./auth.service";
import { CustomerService } from "../customer/customer.service";

@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private customerService: CustomerService
  ) {}

  @Get("azure-auth")
  async azureAuth(@Req() query: Request, @Res() res: Response): Promise<any> {
    return res.redirect("https://www.google.com");
  }

  @Post("sign-in")
  async signin(@Body() signinDto: SignInDto): Promise<any> {
    return await this.authService.signin(signinDto);
  }
  //.ss

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

  // ---------------- Admin auth apis -----------------------

  // @Post("admin/sign-in")
  // async adminSignin(@Body() signinDto: SignInDto): Promise<any> {
  //   return await this.authService.adminSignin(signinDto);
  // }

  // @Post("admin/sign-up")
  // async AdminSignup(
  //   @Body() signupDto: AdminSignupDto
  // ): Promise<ResponseSignUpDto> {
  //   return await this.authService.AdminSignup(signupDto);
  // }

  // ------------ customer auth apis --------------------

  @Get("customer/check-customer/:phoneNumber")
  async checkCRMCustomer(
    @Param("phoneNumber") phoneNumber: string
  ): Promise<any> {
    try {
      const isValidPhoneNumber = validatePhoneNumber(phoneNumber);
      if (!isValidPhoneNumber)
        throw new HttpException("Invalid phone number", HttpStatus.BAD_REQUEST);
      return await this.customerService.checkCRMCustomer(phoneNumber);
    } catch (error) {
      throw error;
    }
  }

  @Post("customer/verify-phone-number")
  async verifyPhoneNumber(
    @Body("phoneNumber") phoneNumber: string
  ): Promise<string> {
    try {
      const isValidPhoneNumber = validatePhoneNumber(phoneNumber);
      if (!isValidPhoneNumber)
        throw new HttpException("Invalid phone number", HttpStatus.BAD_REQUEST);
      return this.customerService.verifyPhoneNumber(phoneNumber);
    } catch (error) {
      throw error;
    }
  }

  @Post("customer/verify-phone-number/otp")
  async verifyCustomerOtp(
    @Body("phoneNumber") phoneNumber: string,
    @Body("otp") otp: string
  ): Promise<string> {
    try {
      const isValidPhoneNumber = validatePhoneNumber(phoneNumber);
      if (!isValidPhoneNumber)
        throw new HttpException("Invalid phone number", HttpStatus.BAD_REQUEST);
      return this.customerService.verifyCustomerOtp(phoneNumber, otp);
    } catch (error) {
      throw error;
    }
  }

  @Post("customer")
  async createCustomer(@Body() customer: CreateCustomer): Promise<Customer> {
    const isValidPhoneNumber = validatePhoneNumber(customer?.phoneNumber);
    if (!isValidPhoneNumber)
      throw new HttpException("Invalid phone number", HttpStatus.BAD_REQUEST);
    return await this.customerService.create(customer);
  }

  @Post("customer/request-forget-password")
  async requestForgetPassword(
    @Body() updatePasswordReq: UpdatePasswordRequest
  ): Promise<string> {
    try {
      const { phoneNumber } = updatePasswordReq;

      const isValidPhoneNumber = validatePhoneNumber(phoneNumber);
      if (!isValidPhoneNumber)
        throw new HttpException("Invalid phone number", HttpStatus.BAD_REQUEST);

      return await this.customerService.requestForgetPassword(phoneNumber);
    } catch (error) {
      throw error;
    }
  }

  @Post("customer/verify-otp")
  async verifyPasswordOtp(@Body() verifyOtp: VerifyOtp): Promise<string> {
    const { phoneNumber } = verifyOtp;

    const isValidPhoneNumber = validatePhoneNumber(phoneNumber);
    if (!isValidPhoneNumber)
      throw new HttpException("Invalid phone number", HttpStatus.BAD_REQUEST);

    return await this.customerService.verifyPassowrdOtp(verifyOtp);
  }

  @Post("customer/login")
  async login(@Body() loginDto: CustomerLogin): Promise<any> {
    const { phoneNumber } = loginDto;

    const isValidPhoneNumber = validatePhoneNumber(phoneNumber);
    if (!isValidPhoneNumber)
      throw new HttpException("Invalid phone number", HttpStatus.BAD_REQUEST);
    return await this.customerService.login(loginDto);
  }

  @Patch("customer/update-password")
  async updateCustomerPassword(
    @Body() updatePassword: UpdatePassword
  ): Promise<Customer> {
    const { phoneNumber } = updatePassword;

    const isValidPhoneNumber = validatePhoneNumber(phoneNumber);
    if (!isValidPhoneNumber)
      throw new HttpException("Invalid phone number", HttpStatus.BAD_REQUEST);

    return await this.customerService.updatePassword(updatePassword);
  }

  @Post("customer/resend-otp")
  async resendOtp(@Body("phoneNumber") phoneNumber: string): Promise<string> {
    try {
      const isValidPhoneNumber = validatePhoneNumber(phoneNumber);
      if (!isValidPhoneNumber)
        throw new HttpException("Invalid phone number", HttpStatus.BAD_REQUEST);
      return this.customerService.resendOtp(phoneNumber);
    } catch (error) {
      throw error;
    }
  }
}
