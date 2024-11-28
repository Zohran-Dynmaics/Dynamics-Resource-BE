import { forwardRef, Module } from "@nestjs/common";
import { BookingController } from "./booking.controller";
import { BookingService } from "./booking.service";
import { ApiModule } from "src/modules/api/api.module";
import { EnvironmentModule } from "src/modules/admin/environment/environment.module";
import { CmsModule } from "../../cms.module";

@Module({
  imports: [forwardRef(() => ApiModule)],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService]
})
export class BookingModule {}
