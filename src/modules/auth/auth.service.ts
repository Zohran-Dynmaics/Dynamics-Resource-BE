import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from "@nestjs/common";
import { ResponseSignUpDto, SignInDto, SignUpDto } from "./auth.dto";
import * as bcrypt from "bcrypt";
import { UsersService } from "../users/users.service";
import { generateHash } from "src/shared/utility";
import { User } from "../users/users.entity";
import { JwtService } from "@nestjs/jwt";
import { CmsService } from "./../cms/cms.service";
import { EnvironmentService } from "../environment/environment.service";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private cmsService: CmsService,
    private envService: EnvironmentService,
  ) { }

  async signup(signupDto: SignUpDto): Promise<ResponseSignUpDto> {
    try {
      const { email, password } = signupDto;
      const user = await this.usersService.findByEmail(email.toLowerCase());
      if (user) {
        throw new HttpException("User already exists", HttpStatus.BAD_REQUEST);
      }
      const hashedPassword: string = await generateHash(password);
      const createdUser: User = await this.usersService.create(
        email.toLowerCase(),
        hashedPassword,
      );
      return { user: createdUser };
    } catch (error) {
      throw error;
    }
  }

  async signin(singinDto: SignInDto): Promise<any> {
    try {
      const { email, password } = singinDto;
      const env_name = email.split("@")[1].split(".")[0];
      const env = await this.envService.findByName(env_name);
      if (!env) {
        throw new HttpException(
          "Environment not found.",
          HttpStatus.BAD_REQUEST,
        );
      }
      const { access_token } = await this.cmsService.getCrmToken(env);
      const { value } =
        await this.cmsService.getBookableResources(access_token);
      const userValidation = value.find(
        (user) =>
          email.includes(user.cafm_username) && user.cafm_password == password,
      );
      if (!userValidation)
        throw new HttpException("Invalid credentials", HttpStatus.BAD_REQUEST);
      return { access_token };
    } catch (error) {
      throw error;
    }
  }

  async comparePasswords(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  async generateToken(payload: Partial<User>): Promise<string> {
    return await this.jwtService.signAsync(payload);
  }
}
