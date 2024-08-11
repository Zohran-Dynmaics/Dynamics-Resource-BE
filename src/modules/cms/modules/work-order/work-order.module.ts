import { Module } from "@nestjs/common";
import { WorkOrderController } from "./work-order.controller";
import { WorkOrderService } from "./work-order.service";
import { ApiModule } from "src/modules/api/api.module";

@Module({
  imports: [ApiModule],
  controllers: [WorkOrderController],
  providers: [WorkOrderService],
})
export class WorkOrderModule {}
