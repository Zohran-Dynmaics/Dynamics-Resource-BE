import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { sendMail } from "src/shared/utility/mail.util";
import {
  generateHash,
  getEnvironmentNameFromEmail
} from "src/shared/utility/utility";
import { EnvironmentService } from "../admin/environment/environment.service";
import { User } from "../admin/users/users.entity";
import { UsersService } from "../admin/users/users.service";
import { CmsService } from "./../cms/cms.service";
import {
  ResponseSignUpDto,
  SignInDto,
  SignUpDto,
  TokenPayloadDto,
  UpdatePasswordDto,
  UpdatePasswordRequestDto,
  VerifyOtpDto
} from "./auth.dto";
import { OTP_EMAIL_TEMPLATE } from "./constants";
import moment from "moment";
const otpGenerator = require("otp-generator");

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private cmsService: CmsService,
    private envService: EnvironmentService
  ) {}

  async signup(signupDto: SignUpDto): Promise<ResponseSignUpDto> {
    try {
      const { username, password, env_name } = signupDto;
      const user = await this.usersService.findByUsername(
        username.toLowerCase()
      );
      if (user) {
        throw new HttpException("User already exists.", HttpStatus.BAD_REQUEST);
      }
      const { userValidation } = await this.verifyUserOnCrm(
        username,
        password,
        env_name
      );
      if (!userValidation)
        throw new HttpException(
          "Not verified by CRM. Signup with CRM credentials.",
          HttpStatus.BAD_REQUEST
        );
      const hashedPassword: string = await generateHash(password);
      return await this.usersService.create(
        username.toLowerCase(),
        hashedPassword,
        userValidation?.UserId?.defaultmailbox?.emailaddress,
        userValidation.bookableresourceid,
        env_name.toLowerCase(),
        userValidation?.UserId?.title
      );
    } catch (error) {
      throw error;
    }
  }

  async signin(singinDto: SignInDto): Promise<any> {
    try {
      const { username, password, env_name } = singinDto;
      let user: any = await this.usersService.findByUsername(
        username.toLowerCase()
      );
      if (!user) {
        user = await this.signup(singinDto);
      }
      const isMatch = await this.comparePasswords(password, user.password);
      if (!isMatch) {
        throw new HttpException("Invalid credentials", HttpStatus.BAD_REQUEST);
      }
      const { userValidation, env, updatedUser } = await this.verifyUserOnCrm(
        username,
        password,
        env_name
      );
      if (!userValidation)
        throw new HttpException("Not verified by CRM.", HttpStatus.BAD_REQUEST);
      const payload: TokenPayloadDto = {
        user: {
          _id: user?._id,
          email: user?.email,
          bookableresourceid: user?.resourceId,
          role: user?.roles
        },
        env: {
          _id: env?._id,
          base_url: env?.base_url,
          name: env?.env_name
        }
      };
      return {
        token: await this.generateToken(payload),
        user: updatedUser
      };
    } catch (error) {
      //("🚀 ~ AuthService ~ signin ~ error:", error)
      throw error;
    }
  }

  async updatePasswordRequest(
    updatePasswordReqDto: UpdatePasswordRequestDto
  ): Promise<{ message: string }> {
    try {
      const { email } = updatePasswordReqDto;
      const user = await this.usersService.findByEmail(email.toLowerCase());
      if (!user) {
        throw new HttpException("User not found.", HttpStatus.UNAUTHORIZED);
      }

      const resetPasswordOtp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false
      });
      const resetPasswordOtpExpiry = new Date().setMinutes(
        new Date().getMinutes() + 5
      );

      await sendMail(OTP_EMAIL_TEMPLATE(email, resetPasswordOtp));

      user.resetPasswordOtp = resetPasswordOtp;
      user.resetPasswordOtpExpiry = new Date(resetPasswordOtpExpiry);
      user.resetPasswordRequested = true;
      await user.save();
      return { message: "OTP has been sent to your provided email." };
    } catch (error) {
      throw error;
    }
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<{ message: string }> {
    try {
      const { email, otp } = verifyOtpDto;
      const user = await this.usersService.findByEmail(email.toLowerCase());
      if (!user) {
        throw new HttpException("User not found.", HttpStatus.UNAUTHORIZED);
      }

      const { resetPasswordOtp, resetPasswordOtpExpiry } = user;

      if (!resetPasswordOtp) {
        throw new HttpException(
          "You already verified OTP or not requested password update yet.",
          HttpStatus.BAD_REQUEST
        );
      }

      if (new Date().getTime() > resetPasswordOtpExpiry.getTime()) {
        throw new HttpException("OTP expired.", HttpStatus.BAD_REQUEST);
      }

      if (resetPasswordOtp !== otp) {
        throw new HttpException("Invalid OTP.", HttpStatus.BAD_REQUEST);
      }

      user.resetPasswordOtp = null;
      user.resetPasswordOtpExpiry = null;
      await user.save();
      return {
        message: "OTP verified successfully. You can change your password now."
      };
    } catch (error) {
      throw error;
    }
  }

  async updatePassword(updatePasswordDto: UpdatePasswordDto): Promise<User> {
    try {
      const { email, password } = updatePasswordDto;
      const user = await this.usersService.findByEmail(email);

      if (!user) {
        throw new HttpException("User not found.", HttpStatus.UNAUTHORIZED);
      } else if (!user.resetPasswordRequested) {
        throw new HttpException(
          "You have not requested update password yet. Please follow the password reset flow first.",
          HttpStatus.BAD_REQUEST
        );
      } else if (user.resetPasswordRequested && user.resetPasswordOtp) {
        throw new HttpException(
          "Please verify your otp first.",
          HttpStatus.UNAUTHORIZED
        );
      }

      return await this.usersService.update({
        _id: user._id,
        password,
        resetPasswordRequested: false
      });
    } catch (error) {
      throw error;
    }
  }

  async comparePasswords(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  async generateToken(payload: any): Promise<string> {
    return await this.jwtService.signAsync(payload);
  }
  async verifyUserOnCrm(
    username: string,
    password: string,
    env_name: string
  ): Promise<any> {
    try {
      const env = await this.envService.findByName(env_name);
      const access_token =
        env?.token ?? (await this.cmsService.getCrmToken(env)).access_token;
      const { value } = await this.cmsService.getBookableResources(
        access_token,
        env?.base_url
      );
      const userValidation = value.find((user) => {
        return (
          username.toLowerCase() === user.plus_username.toLowerCase() &&
          user.plus_password === password
        );
      });
      if (!userValidation)
        throw new HttpException(
          "Not verified by CRM. SignUp/SignIn with CRM credentials.",
          HttpStatus.BAD_REQUEST
        );

      const user = await this.usersService.findByUsername(
        username.toLowerCase()
      );

      const { name, accountid } =
        userValidation
          ?.msdyn_bookableresource_msdyn_requirementresourcepreference_BookableResource?.[0]
          ?.msdyn_Account;
      const updatedUser = await this.usersService.update({
        _id: user?._id,
        account:name,
        accountId:accountid
      });

      return { userValidation, env, updatedUser };
    } catch (error) {
      throw error;
    }
  }
}
