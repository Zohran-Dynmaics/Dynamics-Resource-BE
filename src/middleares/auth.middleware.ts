import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { jwtDecode } from "jwt-decode";
import { CmsService } from "src/modules/cms/cms.service";
import { EnvironmentService } from "src/modules/environment/environment.service";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private envService: EnvironmentService,
    private cmsService: CmsService,
  ) { }

  isTokenExpired(exp: any) {
    const currentTime = Math.floor(Date.now() / 1000);
    return exp < currentTime;
  }

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader: any = req?.headers?.authorization;
      if (!authHeader) {
        throw new HttpException("Token not found.", HttpStatus.BAD_REQUEST);
      }
      let token = authHeader.split(" ")[1];
      const decodedToken: any = jwtDecode(token);
      const env = await this.envService.findByBaseUrl(decodedToken.aud);

      req["crmToken"] = token;
      req["env"] = env;

      if (this.isTokenExpired(decodedToken.exp)) {
        const { access_token: token } = await this.cmsService.getCrmToken(env);
        req.headers.authorization = `Bearer ${token}`;
        req["crmToken"] = token;
      }

      if (!env) {
        throw new HttpException(
          "Environment not found",
          HttpStatus.BAD_REQUEST,
        );
      }

      next();
    } catch (error) {
      throw error;
    }
  }
}
