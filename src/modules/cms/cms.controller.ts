import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { CmsService } from "./cms.service";
import { GetCrmTokenDto, GetCrmTokenResponseDto } from "./cms.dto";
import { Request } from "express";
import { CustomRequest } from "src/shared/custom-interface";
import { HTTPS_METHODS } from "src/shared/enum";

@Controller("cms")
export class CmsController {
  constructor(private cmsService: CmsService) { }


  @Get("dynamic/:dynamic_endpoint")
  async handleDynamicRoute(
    @Param('dynamic_endpoint') dynamic_endpoint: string,
    @Query() query: any,
    @Req() req: CustomRequest
  ) {
    const { env } = req;
    try {
      const endpoint = `${dynamic_endpoint}?${Object.keys(query).map(key => `${key}=${query[key]}`).join('&')}`;
      return await this.cmsService.getDynamicContent(env?.base_url, env?.token, endpoint);
    } catch (error) {
      throw error;
    }
  }


  @Patch("dynamic/:dynamic_endpoint")
  async PatchDynamicRoute(
    @Param('dynamic_endpoint') dynamic_endpoint: string,
    @Query() query: any,
    @Req() req: CustomRequest
  ) {
    const { env, body } = req;
    try {
      const endpoint = `${dynamic_endpoint}?${Object.keys(query).map(key => `${key}=${query[key]}`).join('&')}`;
      return await this.cmsService.CreateOrUpdateDynamicContent(env?.base_url, env?.token, endpoint, HTTPS_METHODS.PATCH, body);
    } catch (error) {
      throw error;
    }
  }


  @Post("dynamic/:dynamic_endpoint")
  async PostDynamicRoute(
    @Param('dynamic_endpoint') dynamic_endpoint: string,
    @Query() query: any,
    @Req() req: CustomRequest
  ) {
    const { env, body } = req;
    try {
      const endpoint = `${dynamic_endpoint}?${Object.keys(query).map(key => `${key}=${query[key]}`).join('&')}`;
      return await this.cmsService.CreateOrUpdateDynamicContent(env?.base_url, env?.token, endpoint, body, HTTPS_METHODS.POST);
    } catch (error) {
      throw error;
    }
  }



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
