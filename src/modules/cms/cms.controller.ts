import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { CmsService } from "./cms.service";
import { GetCrmTokenDto, GetCrmTokenResponseDto } from "./cms.dto";
import { Request } from "express";
import { CustomRequest } from "src/shared/custom-interface";

@Controller("cms")
export class CmsController {
  constructor(private cmsService: CmsService) { }


  @Get("home-screen-data")
  async getHomeScreenData(@Req() req: CustomRequest): Promise<any> {
    const { env, user } = req;
    return await this.cmsService.getHomeScreenData(env, user);
  }

  @Post("crm-token")
  async crmToken(
    @Body() getCrmTokenDto: GetCrmTokenDto,
  ): Promise<GetCrmTokenResponseDto> {
    return await this.cmsService.getCrmToken(getCrmTokenDto);
  }


  @Get("bookable-resource-categories")
  async getBookableResourceCategories(@Req() req: CustomRequest): Promise<any> {
    const { env } = req;
    return await this.cmsService.getBookableResourceCategories(env._id);
  }
}
