import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CmsModule } from "../cms/cms.module";
import { EnvironmentModule } from "../environment/environment.module";
import { UsersController } from "./users.controller";
import { User, UserSchema } from "./users.entity";
import { UsersService } from "./users.service";

@Module({
  imports: [
    EnvironmentModule,
    CmsModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule { }
