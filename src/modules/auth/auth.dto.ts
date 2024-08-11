import { IsBoolean, IsEmail, IsNotEmpty } from "class-validator";
import { User } from "../users/users.entity";
import { TokenUserDto } from "../users/users.dto";
import { TokenEnvironmentDto } from "../environment/environment.dto";

export class UpdatePasswordRequestDto {
  @IsNotEmpty({ message: "Email should not be empty." })
  @IsEmail()
  email: string;
}
export class SignUpDto {
  @IsNotEmpty({ message: "Username should not be empty." })
  username: string;

  @IsNotEmpty({ message: "Password should not be empty." })
  password: string;

  @IsNotEmpty({ message: "Environment Name should not be empty." })
  env_name: string;
}

export class SignInDto extends SignUpDto { }

export class ResponseSignUpDto extends User { }

export class UpdatePasswordDto extends UpdatePasswordRequestDto {
  @IsNotEmpty({ message: "Password should not be empty." })
  password: string;
}

export class VerifyOtpDto extends UpdatePasswordRequestDto {
  @IsNotEmpty({ message: "OTP should not be empty." })
  otp: string;
}

export class TokenPayloadDto {
  user: TokenUserDto;
  env: TokenEnvironmentDto;
}
