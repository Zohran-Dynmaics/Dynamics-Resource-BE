import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    return next.handle().pipe(
      map((data: any) => {
        if (data?.token) {
          response.cookie("token", data.token, {
            httpOnly: true,
            secure: true,
            maxAge: 604800000,
          });
        }
        return {
          statusCode: context.switchToHttp().getResponse().statusCode,
          success: true,
          data,
        };
      }),
    );
  }
}
