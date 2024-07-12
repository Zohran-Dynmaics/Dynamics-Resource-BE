import { Body, Controller, Get, Query, Req, UseGuards } from "@nestjs/common";
import { BookingService } from "./booking.service";
import { CustomRequest } from "src/shared/custom-interface";
import { DateDto } from "./booking.dto";
import { AuthService } from './../../../auth/auth.service';
import { URLS_AND_QUERY_PARAMS } from "src/shared/constant";

@Controller("cms/booking")
export class BookingController {
  constructor(private bookingService: BookingService) { }

  @Get("")
  async getTasksOfDay(@Req() req: CustomRequest, @Query() { date }: DateDto): Promise<any> {
    const { env, user } = req;
    return await this.bookingService.getTasksOfDay(env._id, user.bookableresourceid, date);
  }

  @Get("all")
  async getContact(@Req() req: CustomRequest): Promise<any> {
    const { crmToken, env } = req;
    return await this.bookingService.getAllBooking(
      crmToken,
      env.base_url,
      query,
    );
  }

}
