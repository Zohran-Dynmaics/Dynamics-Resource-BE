import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod
} from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { WinstonModule } from "nest-winston";
import * as winston from "winston";
import { AppController } from "./app.controller";
import { LocationModule } from "./location/location.module";
import { AuthMiddleware } from "./middleware/auth.middleware";
import { EnvironmentModule } from "./modules/admin/environment/environment.module";
import { PromoCodeModule } from "./modules/admin/promo-code/promo-code.module";
import { ApiModule } from "./modules/api/api.module";
import { AuthModule } from "./modules/auth/auth.module";
import { CmsModule } from "./modules/cms/cms.module";
import { UsersModule } from "./modules/users/users.module";
import { LoggerModule } from "./logger-module/logger-module.module";
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    // WinstonModule.forRoot({
    //   transports: [
    //     new winston.transports.Console({
    //       format: winston.format.combine(
    //         winston.format.timestamp(),
    //         winston.format.colorize(),
    //         winston.format.printf(({ timestamp, level, message, ...meta }) => {
    //           return `[${timestamp}] ${level}: ${message} ${JSON.stringify(meta)}`;
    //         })
    //       )
    //     }),
    //     new winston.transports.File({
    //       filename: "logs/errors.log",
    //       level: "error",
    //       format: winston.format.combine(
    //         winston.format.timestamp(),
    //         winston.format.json()
    //       )
    //     })
    //   ]
    // }),
    AuthModule,
    UsersModule,
    ApiModule,
    CmsModule,
    EnvironmentModule,
    PromoCodeModule,
    LocationModule,
    LoggerModule
  ],

  controllers: [AppController]

  // providers: [LocationGateway]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude({ path: "auth/(.*)", method: RequestMethod.ALL })
      .forRoutes("*");
  }
}
