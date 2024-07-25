import { Controller, Get, Query, Req } from "@nestjs/common";
import { CustomRequest } from "src/shared/custom-interface";
import {
  CalenderDataDto,
  CalenderDataObjectType,
  OptionalDateDto,
  RequiredDateDto,
  TaskFilterDto,
  TasksCountDto,
  TasksDataDto,
} from "./booking.dto";
import { BookingService } from "./booking.service";

@Controller("cms/bookableresourcebookings")
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @Get("")
  async getTasksOfDay(
    @Req() req: CustomRequest,
    @Query() query: TaskFilterDto,
  ): Promise<Array<TasksDataDto>> {
    const { env, user } = req;
    return await this.bookingService.getTasksOfDay(
      env?.token,
      env?.base_url,
      user?.bookableresourceid,
      query,
    );
  }

  @Get("/booking-count")
  async getTaskCount(@Req() req: CustomRequest): Promise<TasksCountDto> {
    const { env, user } = req;
    return await this.bookingService.getTaskCount(
      env?.token,
      env?.base_url,
      user?.bookableresourceid,
    );
  }

  @Get("/calender-bookings")
  async getCalenderBookings(
    @Req() req: CustomRequest,
    @Query() { date }: RequiredDateDto,
  ): Promise<CalenderDataObjectType> {
    const { env, user } = req;
    return await this.bookingService.getBookingsForCalender(
      env?.token,
      env?.base_url,
      user?.bookableresourceid,
      date,
    );
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
