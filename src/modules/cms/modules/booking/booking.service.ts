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
} from "./utility";
import {
  CalenderDataObjectType,
  TaskDetailDto,
  TaskFilterDto,
  TasksCountDto,
  TasksDataDto,
} from "./booking.dto";

@Injectable()
export class BookingService {
  constructor(private apiService: ApiService) { }

  async getAllBooking(
    token: string,
    base_url: string,
    query?: any,
  ): Promise<any> {
    const config: AxiosRequestConfig = this.apiService.getConfig(
      `${base_url}api/data/v9.1/bookableresourcebookings?`,
      HTTPS_METHODS.GET,
      token,
      query,
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
    params: TaskFilterDto,
  ): Promise<Array<TasksDataDto>> {
    const { endpoint, query } = URLS_AND_QUERY_PARAMS?.BOOKING?.GET?.BOOKINGS;
    const config: AxiosRequestConfig = this.apiService.getConfig(
      `${endpoint(base_url)}${query(params, resource_id)}`,
      HTTPS_METHODS.GET,
      token,
    );
    try {
      const { value }: any = await this.apiService.request(config);
      return FormatDataForTasks(value);
    } catch (error) {
      throw error;
    }
  }

  async getTaskById(token: string, base_url: string, task_id: string): Promise<TaskDetailDto> {
    try {
      const { endpoint, query } = URLS_AND_QUERY_PARAMS?.BOOKING?.GET?.BOOKING_DETAIL;
      const config: AxiosRequestConfig = this.apiService.getConfig(`${endpoint(base_url, task_id)}${query()}`, HTTPS_METHODS.GET, token)
      const apiResponse: any = await this.apiService.request(config);
      return FormatDataForTaskDetail(apiResponse);
    } catch (error) {
      throw error;
    }
  }

  async getTaskCount(
    token: string,
    base_url: string,
    resource_id: string,
  ): Promise<TasksCountDto> {
    try {
      const config: AxiosRequestConfig = this.apiService.getConfig(
        `${base_url}api/data/v9.1/bookableresourcebookings?$filter=_resource_value eq ${resource_id}&$count=true`,
        HTTPS_METHODS.GET,
        token,
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
  ): Promise<CalenderDataObjectType> {
    const { endpoint, query } =
      URLS_AND_QUERY_PARAMS?.BOOKING?.GET?.BOOKINGS_FOR_CALENDER;

    const config: AxiosRequestConfig = this.apiService.getConfig(
      `${endpoint(base_url)}${query(date, resource_id)}`,
      HTTPS_METHODS.GET,
      token,
    );
    try {
      const { value }: any = await this.apiService.request(config);
      return FormatDataForCalender(value, date);
    } catch (error) {
      throw error;
    }
  }
}
