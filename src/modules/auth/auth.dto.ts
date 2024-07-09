import { IsEmail, IsNotEmpty } from "class-validator";
import { User } from "../users/users.entity";

export class SignUpDto {
  @IsNotEmpty({ message: "Email should not be empty." })
  @IsEmail({}, { message: "Invalid Email." })
  email: string;

  @IsNotEmpty({ message: "Password should not be empty." })
  password: string;
}

export class SignInDto extends SignUpDto {}

export class ResponseSignUpDto {
  user: Partial<User>;
}
