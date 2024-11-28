import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
  LoggerService
} from "@nestjs/common";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { Logger } from "winston";
// import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService
  ) {}

  // logger = new Logger();

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = {
      statusCode: status,
      success: false,
      message: exception?.message || "Internal Server Error",
      timestamp: new Date().toISOString(),
      path: request.url
    };

    // Log the error details to Winston
    if (exception instanceof HttpException) {
      const res = exception.getResponse();

      if (typeof res === "object" && res !== null) {
        errorResponse.message = (res as any).message || exception.message;
      }
    }

    this.logger.error("Exception caught", {
      method: request.method,
      url: request.url,
      body: request.body,
      query: request.query,
      params: request.params,
      status,
      errorMessage: exception?.message || "Unknown error",
      stack: exception?.stack || null,
      timestamp: errorResponse.timestamp
    });
    response.status(status).json(errorResponse);
  }
}
