import { Module } from "@nestjs/common";
import { ResourceController } from "./resource.controller";
import { ResourceService } from "./resource.service";
import { ApiModule } from "src/modules/api/api.module";
import { EnvironmentModule } from "src/modules/admin/environment/environment.module";

@Module({
  imports: [ApiModule],
  controllers: [ResourceController],
  providers: [ResourceService],
})
export class ResourceModule { }
