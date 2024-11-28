import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
  LoggerService
} from "@nestjs/common";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const { method, url, body, query, params } = request;

    // Log the incoming request
    this.logger.log("Incoming Request", {
      method,
      url,
      body,
      query,
      params,
      timestamp: new Date().toISOString()
    });

    return next.handle().pipe(
      map((data: any) => {
        if (data?.token) {
          response.cookie("token", data.token, {
            httpOnly: true,
            secure: true,
            maxAge: 604800000
          });
        }

        // Log the outgoing response status
        this.logger.log("Outgoing Response", {
          method,
          url,
          statusCode: response.statusCode, // Log the statusCode instead of the entire response
          timestamp: new Date().toISOString()
        });

        return {
          statusCode: response.statusCode,
          success: true,
          data
        };
      })
    );
  }
}
