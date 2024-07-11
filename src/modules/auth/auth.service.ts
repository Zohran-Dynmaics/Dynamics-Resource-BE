import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef
} from "@nestjs/common";
import {
  ResponseSignUpDto,
  SignInDto,
  SignUpDto,
  UpdatePasswordDto
} from "./auth.dto";
import * as bcrypt from "bcrypt";
import { UsersService } from "../users/users.service";
import { User } from "../users/users.entity";
import { JwtService } from "@nestjs/jwt";
import { CmsService } from "./../cms/cms.service";
import { EnvironmentService } from "../environment/environment.service";
import { UpdateUserDto } from "../users/users.dto";
import { generateHash } from "src/shared/utility/utility";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private cmsService: CmsService,
    private envService: EnvironmentService
  ) { }

  async signup(signupDto: SignUpDto): Promise<ResponseSignUpDto> {
    try {
      const { email, password } = signupDto;
      const user = await this.usersService.findByEmail(email.toLowerCase());
      if (user) {
        throw new HttpException("User already exists.", HttpStatus.BAD_REQUEST);
      }
      const userValidation = await this.verifyUserOnCrm(email, password);
      if (!userValidation)
        throw new HttpException(
          "Not verified by CRM. Signup with CRM credentials.",
          HttpStatus.BAD_REQUEST
        );
      const hashedPassword: string = await generateHash(password);
      return await this.usersService.create(
        email.toLowerCase(),
        hashedPassword,
        userValidation.bookableresourceid
      );
    } catch (error) {
      throw error;
    }
  }

  async signin(singinDto: SignInDto): Promise<any> {
    try {
      const { email, password } = singinDto;
      const user: any = await this.usersService.findByEmail(
        email.toLowerCase()
      );
      if (!user) {
        throw new HttpException("User not found.", HttpStatus.UNAUTHORIZED);
      }
      const isMatch = await this.comparePasswords(password, user.password);

      if (!isMatch) {
        throw new HttpException("Invalid credentials", HttpStatus.BAD_REQUEST);
      }

      const userValidation = await this.verifyUserOnCrm(email, password);
      if (!userValidation)
        throw new HttpException("Not verified by CRM.", HttpStatus.BAD_REQUEST);

      const payload = {
        user: {
          _id: user._id,
          email: user.email,
          bookableresourceid: user.resourceId
        }
      };
      return { token: await this.jwtService.signAsync(payload) };
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
      }

      return await this.usersService.update({
        _id: user._id,
        password
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

  async generateToken(payload: Partial<User>): Promise<string> {
    return await this.jwtService.signAsync(payload);
  }
  async verifyUserOnCrm(email: string, password: string): Promise<any> {
    try {
      const env = await this.envService.findByName(
        this.getEnvironmentNameFromEmail(email)
      );
      const access_token = env?.token ?? (await this.cmsService.getCrmToken(env)).access_token;
      const { value } = await this.cmsService.getBookableResources(access_token);
      const userValidation = value.find(
        (user) => {
          return email.includes(user.cafm_username) && user.cafm_password === password;
        }
      );
      if (!userValidation)
        throw new HttpException(
          "Not verified by CRM. Signup with CRM credentials.",
          HttpStatus.BAD_REQUEST
        );
      return userValidation;
    } catch (error) {
      throw error;
    }
  }
  getEnvironmentNameFromEmail(email: string): string {
    try {
      const env = email.split("@")[1].split(".")[0];
      if (!env) {
        throw new HttpException(
          "Environment not found.",
          HttpStatus.BAD_REQUEST
        );
      }
      return env;
    } catch (error) {
      throw error;
    }
  }
}
