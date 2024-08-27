import {
  MiddlewareConsumer,
  Module,
  NestModule
} from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { AppController } from "./app.controller";
import { AuthMiddleware } from "./middleware/auth.middleware";
import { EnvironmentModule } from "./modules/admin/environment/environment.module";
import { UsersModule } from "./modules/admin/users/users.module";
import { ApiModule } from "./modules/api/api.module";
import { AuthModule } from "./modules/auth/auth.module";
import { CmsModule } from "./modules/cms/cms.module";
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    AuthModule,
    UsersModule,
    ApiModule,
    CmsModule,
    EnvironmentModule,
  ],

  controllers: [AppController]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes("cms/*", "admin/*");
  }
}
