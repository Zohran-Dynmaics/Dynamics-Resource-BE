import { Module } from "@nestjs/common";
import { EnvironmentController } from "./environment.controller";
import { EnvironmentService } from "./environment.service";
import { Mongoose } from "mongoose";
import { MongooseModule } from "@nestjs/mongoose";
import { Environment, EnvironmentSchema } from "./environment.entity";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Environment.name, schema: EnvironmentSchema },
    ]),
  ],
  controllers: [EnvironmentController],
  providers: [EnvironmentService],
  exports: [EnvironmentService],
})
export class EnvironmentModule {}
