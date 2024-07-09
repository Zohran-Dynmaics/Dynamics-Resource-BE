import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { CmsService } from "./cms.service";
import { GetCrmTokenDto, GetCrmTokenResponseDto } from "./cms.dto";
import { Request } from "express";

@Controller("cms")
export class CmsController {
  constructor(private cmsService: CmsService) {}
  /**
   *
   * TODO:
   * 1. When user logs in to out system, get its email and password and compare it with the environment's user's credentials.
   * 2. If user is a valid User, get the token for that respective environment and send it in response of that user.
   * 3. If user is not a valid user, send an error message in response.
   */

  @Post("crm-token")
  async crmToken(
    @Body() getCrmTokenDto: GetCrmTokenDto,
  ): Promise<GetCrmTokenResponseDto> {
    return await this.cmsService.getCrmToken(getCrmTokenDto);
  }

  @Get("bookable-resource-categories")
  async getBookableResourceCategories(@Req() req): Promise<any> {
    const token = req?.crmToken;
    return await this.cmsService.getBookableResourceCategories(token);
  }
}
