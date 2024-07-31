import { Injectable } from "@nestjs/common";
import { AxiosRequestConfig } from "axios";
import { ApiService } from "src/modules/api/api.service";
import { URLS_AND_QUERY_PARAMS } from "src/shared/constant";
import { HTTPS_METHODS } from "src/shared/enum";
import {
  countBookings,
  FormatDataForCalender,
  FormatDataForTaskDetail,
  FormatDataForTasks,
  TaskOfDayFilter,
} from "./utility";
import {
  CalenderDataObjectType,
  TaskDetailDto,
  TaskFilterDto,
  TasksCountDto,
  TasksDataDto,
} from "./booking.dto";
import { BOOKING_ENDPOINTS } from "./contant";

@Injectable()
export class BookingService {
  constructor(private apiService: ApiService) { }

  async getAllBooking(
    token: string,
    base_url: string,
    query?: any,
  ): Promise<any> {
    const { endpoint, searchQuery } = BOOKING_ENDPOINTS.ALL_BOOKINGS;
    const config: AxiosRequestConfig = this.apiService.getConfig(
      `${endpoint(base_url)}`,
      HTTPS_METHODS.GET,
      token,
      searchQuery(query) as string
    );
    try {
      return await this.apiService.request(config);
    } catch (error) {
      throw error;
    }
  }



  async getTasksOfDay(
    token: string,
    base_url: string,
    resource_id: string,
    taskFilterDto?: TaskFilterDto,
    query?: any
  ): Promise<Array<TasksDataDto>> {
    const { endpoint, searchQuery } = BOOKING_ENDPOINTS.ALL_BOOKINGS;
    const config: AxiosRequestConfig = this.apiService.getConfig(
      `${endpoint(base_url)}`,
      HTTPS_METHODS.GET,
      token,
      searchQuery({ $filter: TaskOfDayFilter(resource_id, taskFilterDto?.filter, taskFilterDto?.workordertype), ...query }) as string
    );
    try {
      const { value }: any = await this.apiService.request(config);
      return FormatDataForTasks(value);
    } catch (error) {
      throw error;
    }
  }

  async getTaskById(token: string, base_url: string, task_id: string, query?: any): Promise<TaskDetailDto> {
    try {
      const { endpoint, searchQuery } = BOOKING_ENDPOINTS.BOOKING;
      const config: AxiosRequestConfig = this.apiService.getConfig(`${endpoint(base_url, task_id)}`, HTTPS_METHODS.GET, token, searchQuery(query) as string);
      const apiResponse: any = await this.apiService.request(config);
      return Object.keys(query) ? FormatDataForTaskDetail(apiResponse) : apiResponse;
    } catch (error) {
      throw error;
    }
  }

  async getTaskCount(
    token: string,
    base_url: string,
    resource_id: string,
    query?: any
  ): Promise<TasksCountDto> {
    try {
      const { endpoint, searchQuery } = BOOKING_ENDPOINTS.ALL_BOOKINGS;
      const config: AxiosRequestConfig = this.apiService.getConfig(
        `${endpoint(base_url)}`,
        HTTPS_METHODS.GET,
        token,
        searchQuery({ $filter: `_resource_value eq ${resource_id}`, ...query }) as string
      );
      const apiRespnse: any = await this.apiService.request(config);
      return countBookings(apiRespnse);
    } catch (error) {
      throw error;
    }
  }

  async getBookingsForCalender(
    token: string,
    base_url: string,
    resource_id: string,
    date: Date | string,
  ): Promise<any> {
    const { endpoint, query } =
      URLS_AND_QUERY_PARAMS?.BOOKING?.GET?.BOOKINGS_FOR_CALENDER;

    const config: AxiosRequestConfig = this.apiService.getConfig(
      `${endpoint(base_url)}${query(date, resource_id)}`,
      HTTPS_METHODS.GET,
      token,
    );
    try {
      const apiResponse: any = await this.apiService.request(config);
      return FormatDataForCalender(apiResponse, date);
    } catch (error) {
      throw error;
    }
  }
}
