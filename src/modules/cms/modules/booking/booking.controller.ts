import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { BookingService } from "./booking.service";
import { CustomRequest } from "src/shared/custom-interface";

@Controller("booking")
export class BookingController {
  constructor(private bookingService: BookingService) {}

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
