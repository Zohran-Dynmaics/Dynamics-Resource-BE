import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod
} from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { AppController } from "./app.controller";
import { AuthMiddleware } from "./middleware/auth.middleware";
import { EnvironmentModule } from "./modules/admin/environment/environment.module";
import { UsersModule } from "./modules/users/users.module";
import { ApiModule } from "./modules/api/api.module";
import { AuthModule } from "./modules/auth/auth.module";
import { CmsModule } from "./modules/cms/cms.module";
import { PromoCodeModule } from "./modules/admin/promo-code/promo-code.module";
import { LocationGateway } from "./location/location.gateway";
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    AuthModule,
    UsersModule,
    ApiModule,
    CmsModule,
    EnvironmentModule,
    PromoCodeModule
  ],

  controllers: [AppController],

  providers: [LocationGateway]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude({ path: "auth/(.*)", method: RequestMethod.ALL })
      .forRoutes("*");
  }
}
