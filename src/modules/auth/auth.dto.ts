import { IsBoolean, IsEmail, IsNotEmpty, IsString } from "class-validator";
import { User } from "../users/users.entity";
import { TokenUserDto } from "../users/users.dto";
import { TokenEnvironmentDto } from "../admin/environment/environment.dto";

export class UpdatePasswordRequestDto {
  @IsNotEmpty({ message: "Email should not be empty." })
  @IsEmail()
  email: string;
}

export class UpdatePasswordRequest {
  @IsNotEmpty({ message: "Email should not be empty." })
  @IsString()
  phoneNumber: string;
}
export class SignUpDto {
  @IsNotEmpty({ message: "Username should not be empty." })
  username: string;

  @IsNotEmpty({ message: "Password should not be empty." })
  password: string;

  @IsNotEmpty({ message: "Environment Name should not be empty." })
  env_name: string;
}

export class AdminSignupDto extends SignUpDto {
  @IsNotEmpty({ message: "Username should not be empty." })
  email: string;

  @IsNotEmpty()
  @IsString({ each: true })
  access?: string[];
}

export class SignInDto extends SignUpDto {}

export class ResponseSignUpDto extends User {}

export class UpdatePasswordDto extends UpdatePasswordRequestDto {
  @IsNotEmpty({ message: "Password should not be empty." })
  password: string;
}

export class UpdatePassword extends UpdatePasswordRequest {
  @IsNotEmpty({ message: "Password should not be empty." })
  password: string;
}

export class VerifyOtpDto extends UpdatePasswordRequestDto {
  @IsNotEmpty({ message: "OTP should not be empty." })
  otp: string;
}

export class VerifyOtp extends UpdatePasswordRequest {
  @IsNotEmpty({ message: "OTP should not be empty." })
  otp: string;
}

export class TokenPayloadDto {
  user: TokenUserDto;
  env: TokenEnvironmentDto;
}
