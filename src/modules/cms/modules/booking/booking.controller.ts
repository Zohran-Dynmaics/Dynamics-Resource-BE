import { Controller, Get, Query, Req } from "@nestjs/common";
import { CustomRequest } from "src/shared/custom-interface";
import { DateDto } from "./booking.dto";
import { BookingService } from "./booking.service";

@Controller("cms/booking")
export class BookingController {
  constructor(private bookingService: BookingService) { }

  @Get("")
  async getTasksOfDay(@Req() req: CustomRequest, @Query() { date }: DateDto): Promise<any> {
    const { env, user } = req;
    return await this.bookingService.getTasksOfDay(env.token, env.base_url, user.bookableresourceid, date);
  }

  @Get("all")
  async getContact(@Req() req: CustomRequest): Promise<any> {
    const { env, query } = req;
    return await this.bookingService.getAllBooking(
      env.token,
      env.base_url,
      query,
    );
  }

}
