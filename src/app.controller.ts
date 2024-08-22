import { Controller, Get, Req } from "@nestjs/common";
import { CustomRequest } from "src/shared/custom-interface";

@Controller()
export class AppController {
    constructor() { }

    @Get()
    async Home(@Req() req: CustomRequest): Promise<string> {
        return "Cms is running is running";
    }
}
