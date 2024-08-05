import { Body, Controller, Get, Patch, Query, Req } from "@nestjs/common";
import { CustomRequest } from "src/shared/custom-interface";
import {
  CalenderDataDto,
  CalenderDataObjectType,
  OptionalDateDto,
  RequiredDateDto,
  TaskDetailDto,
  TaskFilterDto,
  TasksCountDto,
  TasksDataDto,
  TaskUpdateDto,
} from "./booking.dto";
import { BookingService } from "./booking.service";

@Controller("cms/bookableresourcebookings")
export class BookingController {
  constructor(private bookingService: BookingService) { }

  @Get("/booking-count")
  async getTaskCount(@Req() req: CustomRequest): Promise<TasksCountDto> {
    const { env, user, query } = req;
    return await this.bookingService.getTaskCount(
      env?.token,
      env?.base_url,
      user?.bookableresourceid,
      query
    );
  }

  @Get("/calender-bookings")
  async getCalenderBookings(
    @Req() req: CustomRequest,
    @Query() { date }: RequiredDateDto,
  ): Promise<CalenderDataObjectType> {
    const { env, user } = req;
    return await this.bookingService.get_bookings_for_calender(
      env?.token,
      env?.base_url,
      user?.bookableresourceid,
      date,
    );
  }

  @Get("")
  async get_tasks_of_day(
    @Req() req: CustomRequest,
    @Query() taskFilterDto: TaskFilterDto,
  ): Promise<Array<TasksDataDto>> {
    const { env, user, query } = req;
    return await this.bookingService.get_tasks_of_day(
      env?.token,
      env?.base_url,
      user?.bookableresourceid,
      taskFilterDto,
      query
    );
  }

  @Get("/:id")
  async getTaskById(@Req() req: CustomRequest): Promise<TaskDetailDto> {
    const { env, params, query } = req;
    return await this.bookingService.getTaskById(
      env?.token,
      env?.base_url,
      params.id,
      query
    );
  }

  @Get("all")
  async getContact(@Req() req: CustomRequest): Promise<any> {
    const { env, query } = req;
    return await this.bookingService.get_all_bookings(
      env.token,
      env.base_url,
      query,
    );
  }

  @Patch("/:id")
  async updateTask(@Req() req: CustomRequest, @Body() updateTaskDto: TaskUpdateDto): Promise<any> {
    const { env, params } = req;
    return await this.bookingService.updateTask(
      env?.token,
      env?.base_url,
      params?.id,
      updateTaskDto,
    );
  }


}
