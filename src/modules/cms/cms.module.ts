import { Module, forwardRef } from "@nestjs/common";
import { CmsController } from "./cms.controller";
import { CmsService } from "./cms.service";
import { ApiModule } from "../api/api.module";
import { EnvironmentModule } from "../admin/environment/environment.module";
import { ProductModule } from "./modules/product/product.module";
import { ContactModule } from "./modules/contact/contact.module";
import { BookingModule } from "./modules/booking/booking.module";
import { ResourceModule } from "./modules/resource/resource.module";
import { IncidentModule } from "./modules/incident/incident.module";
import { WorkOrderModule } from "./modules/work-order/work-order.module";
import { ProblemIssueModule } from "./modules/problem-issue/problem-issue.module";

@Module({
  imports: [
    forwardRef(() => ApiModule),
    EnvironmentModule,
    ProductModule,
    ContactModule,
    BookingModule,
    ResourceModule,
    IncidentModule,
    WorkOrderModule,
    ProblemIssueModule
  ],
  controllers: [CmsController],
  providers: [CmsService],
  exports: [CmsService]
})
export class CmsModule {}
