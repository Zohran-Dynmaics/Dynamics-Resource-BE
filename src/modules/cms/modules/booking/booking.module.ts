import { Module } from "@nestjs/common";
import { BookingController } from "./booking.controller";
import { BookingService } from "./booking.service";
import { ApiModule } from "src/modules/api/api.module";
import { EnvironmentModule } from "src/modules/environment/environment.module";
import { CmsModule } from "../../cms.module";

@Module({
  imports: [ApiModule],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
