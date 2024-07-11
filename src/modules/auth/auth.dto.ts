import { IsBoolean, IsEmail, IsNotEmpty } from "class-validator";
import { User } from "../users/users.entity";

export class UpdatePasswordRequestDto {
  @IsNotEmpty({ message: "Email should not be empty." })
  @IsEmail({}, { message: "Invalid Email." })
  email: string;
}
export class SignUpDto extends UpdatePasswordRequestDto {
  @IsNotEmpty({ message: "Password should not be empty." })
  password: string;
}

export class SignInDto extends SignUpDto { }

export class ResponseSignUpDto extends User {
}

export class UpdatePasswordDto extends SignUpDto {
}

export class VerifyOtpDto extends UpdatePasswordRequestDto {
  @IsNotEmpty({ message: "OTP should not be empty." })
  otp: string;
}