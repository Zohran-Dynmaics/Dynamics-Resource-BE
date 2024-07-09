import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
// import { User } from 'src/module/user/user.schema';

@Injectable()
export class CrmTokenGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    // const user: Partial<User> = request.user;
    const user: any = { crmToken: "abc" };
    try {
      if (!user?.crmToken) {
        throw new HttpException(
          "Login to crm is required.",
          HttpStatus.FORBIDDEN,
        );
      }
      return true;
    } catch (error) {
      throw error;
    }
  }
}
