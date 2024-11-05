import { Module, forwardRef } from "@nestjs/common";
import { ApiService } from "./api.service";
import { HttpModule as AxiosModule } from "@nestjs/axios";
import { UsersModule } from "../users/users.module";
import { CmsModule } from "../cms/cms.module";

@Module({
  imports: [AxiosModule, forwardRef(() => CmsModule)],
  providers: [ApiService],
  exports: [ApiService]
})
export class ApiModule {}
