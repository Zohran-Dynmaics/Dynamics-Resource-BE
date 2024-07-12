import { Injectable } from "@nestjs/common";
import { AxiosRequestConfig } from "axios";
import { ApiService } from "src/modules/api/api.service";
import { URLS_AND_QUERY_PARAMS } from "src/shared/constant";
import { HTTPS_METHODS } from "src/shared/enum";

@Injectable()
export class BookingService {
  constructor(private apiService: ApiService) { }

  async getAllBooking(
    token: string,
    base_url: string,
    query?: any,
  ): Promise<any> {
    const config: AxiosRequestConfig = this.apiService.getConfig(
      `${base_url}api/data/v9.1/bookableresourcebookings`,
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
    date: Date | string,
  ): Promise<any> {
    const { endpoint, query } = URLS_AND_QUERY_PARAMS.BOOKING.GET.TASKS_OF_DAY;
    const config: AxiosRequestConfig = this.apiService.getConfig(
      `${endpoint(base_url)}${query(date, resource_id)}`,
      HTTPS_METHODS.GET,
      token,
    );

    try {
      return await this.apiService.request(config);
    } catch (error) {
      throw error;
    }
  }
}
