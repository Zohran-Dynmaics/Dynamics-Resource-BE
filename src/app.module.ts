import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod
} from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { ApiModule } from "./modules/api/api.module";
import { CmsModule } from "./modules/cms/cms.module";
import { EnvironmentModule } from "./modules/environment/environment.module";
import { EnvironmentService } from "./modules/environment/environment.service";
import { CmsService } from "./modules/cms/cms.service";
import { AuthMiddleware } from "./middleares/auth.middleware";
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    AuthModule,
    UsersModule,
    ApiModule,
    CmsModule,
    EnvironmentModule
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude({ path: 'auth/(.*)', method: RequestMethod.ALL })
      .forRoutes('*');
  }
}
