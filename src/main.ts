import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ResponseInterceptor } from "./interceptors/response.interceptor";
import { ConfigService } from "@nestjs/config";
import { HttpExceptionFilter } from "./filters/exception.filters";
import { Logger as NestLogger, ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";
import * as bodyParser from "body-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true
    })
  );

  app.use(cookieParser());

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors();
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

  app.setGlobalPrefix("api/v0");

  const port = configService.get("APP_PORT") || 3000;
  await app.listen(port, () => {
    const nestLogger = new NestLogger();
    nestLogger.log(`Dynamics Plus is running on port : ${port}`);
  });
}
bootstrap();
