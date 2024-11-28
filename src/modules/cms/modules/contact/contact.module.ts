import { forwardRef, Module } from "@nestjs/common";
import { ContactController } from "./contact.controller";
import { ContactService } from "./contact.service";
import { ApiModule } from "src/modules/api/api.module";
import { EnvironmentModule } from "src/modules/admin/environment/environment.module";
import { CmsModule } from "../../cms.module";

@Module({
  imports: [forwardRef(() => ApiModule)],
  controllers: [ContactController],
  providers: [ContactService]
})
export class ContactModule {}
