import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService
  ) { }


  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader: any = req?.headers?.authorization;
      if (!authHeader) {
        throw new HttpException("Token not found.", HttpStatus.BAD_REQUEST);
      }
      const token = authHeader.split(" ")[1];
      const decodedToken: any = this.jwtService.verify(token)
      console.log("🚀 ~ AuthMiddleware ~ use ~ decodedToken:", decodedToken)

      if (!decodedToken) {
        throw new HttpException("Invalid token", HttpStatus.UNAUTHORIZED);
      }
      req["user"] = decodedToken.user;
      next();
    } catch (error) {
      throw error;
    }
  }
}
