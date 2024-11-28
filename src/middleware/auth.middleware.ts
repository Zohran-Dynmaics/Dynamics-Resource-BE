import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { NextFunction, Request, Response } from "express";
import { ApiService } from "src/modules/api/api.service";
import { CmsService } from "src/modules/cms/cms.service";
import { EnvironmentService } from "src/modules/admin/environment/environment.service";
import { CustomRequest } from "src/shared/custom-interface";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private envService: EnvironmentService,
    private cmsService: CmsService
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader: any = req?.headers?.authorization;

      if (!authHeader) {
        throw new HttpException("Token not found.", HttpStatus.UNAUTHORIZED);
      }
      const token = authHeader.split(" ")[1];
      let decodedToken = null;

      try {
        const decodedToken: any = this.jwtService.verify(token);
      } catch (error) {
        throw new HttpException("Token Expired", HttpStatus.UNAUTHORIZED);
      }
      if (!decodedToken) {
        throw new HttpException("Invalid token", HttpStatus.UNAUTHORIZED);
      }
      const env = await this.envService.findById(decodedToken?.env?._id);
      const crmToken =
        env?.token ?? (await this.cmsService.getCrmToken(env)).access_token;
      req["user"] = decodedToken.user;
      req["env"] = { ...decodedToken.env, token: crmToken };
      next();
    } catch (error) {
      throw error;
    }
  }
}
