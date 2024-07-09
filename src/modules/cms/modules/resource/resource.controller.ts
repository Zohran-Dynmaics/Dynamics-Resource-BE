import { Body, Controller, Get, Req, UseGuards } from "@nestjs/common";
import { ResourceService } from "./resource.service";
import { CustomRequest } from "src/shared/custom-interface";
import { GetResourceSlotsDto } from "./resource.dto";

@Controller("cms/resource")
export class ResourceController {
  constructor(private resourceService: ResourceService) { }

  @Get("")
  async getBookableResource(@Req() req: CustomRequest) {
    const { crmToken, env, query } = req;
    return await this.resourceService.getBookableResource(
      crmToken,
      env.base_url,
      query,
    );
  }
  @Get("categories")
  async getBookableResourceCategories(@Req() req: CustomRequest) {
    const { crmToken, env, query } = req;
    return await this.resourceService.getBookableResourceCategories(
      crmToken,
      env.base_url,
      query,
    );
  }

  @Get("characteristics")
  async getBookableResourceCharacteristics(@Req() req: CustomRequest) {
    const { crmToken, env, query } = req;
    return await this.resourceService.getBookableResourceCharacteristics(
      crmToken,
      env.base_url,
      query,
    );
  }

  @Get("available-resource-slots")
  async getAvailableResourceSlots(
    @Req() req: CustomRequest,
    @Body() getResourceSlot: GetResourceSlotsDto
  ) {
    const { crmToken, env, query } = req;
    return await this.resourceService.getAvailableResourceSlots(
      crmToken,
      env.base_url,
      getResourceSlot,
      query,
    );
  }
}
