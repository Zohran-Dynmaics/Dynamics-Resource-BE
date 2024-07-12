import { Controller, Get, Req } from '@nestjs/common';
import { WorkOrderService } from './work-order.service';
import { CustomRequest } from 'src/shared/custom-interface';

@Controller('cms/work-order')
export class WorkOrderController {
    constructor(private workOrderService: WorkOrderService) { }

    @Get("types")
    async getWorkOrderTypes(@Req() req: CustomRequest) {
        const { env } = req;
        return await this.workOrderService.getWorkOrderTypes(env?.token, env?.base_url);
    }


}
