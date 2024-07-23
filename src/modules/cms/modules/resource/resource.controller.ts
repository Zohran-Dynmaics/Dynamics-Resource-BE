import { Body, Controller, Get, Req, UseGuards } from "@nestjs/common";
import { ResourceService } from "./resource.service";
import { CustomRequest } from "src/shared/custom-interface";
import { GetResourceSlotsDto } from "./resource.dto";

@Controller("cms")
export class ResourceController {
  constructor(private resourceService: ResourceService) { }

  @Get("bookableresources")
  async getBookableResource(@Req() req: CustomRequest) {
    const { env, query } = req;
    return await this.resourceService.getBookableResource(
      env?.token,
      env?.base_url,
      query,
    );
  }
  @Get("bookableresourcecategories")
  async getBookableResourceCategories(@Req() req: CustomRequest) {
    const { env, query } = req;
    return await this.resourceService.getBookableResourceCategories(
      env?.token,
      env?.base_url,
      query,
    );
  }

  @Get("bookableresourcecharacteristics")
  async getBookableResourceCharacteristics(@Req() req: CustomRequest) {
    const { env, query } = req;
    return await this.resourceService.getBookableResourceCharacteristics(
      env?.token,
      env?.base_url,
      query,
    );
  }

  @Get("cafm_AvailableResourceSlot")
  async getAvailableResourceSlots(
    @Req() req: CustomRequest,
    @Body() getResourceSlot: GetResourceSlotsDto
  ) {
    const { env, query } = req;
    return await this.resourceService.getAvailableResourceSlots(
      env?.token,
      env.base_url,
      getResourceSlot,
      query,
    );
  }
}
