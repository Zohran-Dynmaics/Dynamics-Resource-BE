import { Request } from "express";
import { TokenEnvironmentDto } from "src/modules/environment/environment.dto";
import { TokenUserDto } from "src/modules/users/users.dto";

export interface CustomRequest extends Request {
  env: TokenEnvironmentDto;
  user: TokenUserDto;
}
