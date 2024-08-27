import { Request } from "express";
import { TokenEnvironmentDto } from "src/modules/admin/environment/environment.dto";
import { TokenUserDto } from "src/modules/admin/users/users.dto";

export interface CustomRequest extends Request {
  env: TokenEnvironmentDto;
  user: TokenUserDto;
}
