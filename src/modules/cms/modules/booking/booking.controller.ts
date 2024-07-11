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
    const { crmToken, env } = req;
    const { endpoint, query } = URLS_AND_QUERY_PARAMS.BOOKING.GET.TASKS_OF_DAY;
    return await this.bookingService.getTasksOfDay(crmToken, endpoint(env.base_url), query(date, "3578de06-8502-ed11-82e5-000d3ada26aa"));
  }

  @Get("all")
  async getContact(@Req() req: CustomRequest): Promise<any> {
    const { crmToken, env, query } = req;
    return await this.bookingService.getAllBooking(
      crmToken,
      env.base_url,
      query,
    );
  }

}
