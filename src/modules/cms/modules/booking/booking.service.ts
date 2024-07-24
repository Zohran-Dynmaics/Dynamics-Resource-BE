import { Injectable } from "@nestjs/common";
import { AxiosRequestConfig } from "axios";
import { response } from "express";
import * as moment from "moment";
import { ApiService } from "src/modules/api/api.service";
import { URLS_AND_QUERY_PARAMS } from "src/shared/constant";
import { HTTPS_METHODS } from "src/shared/enum";
import { countBookings, FormatDataForCalender } from "./utility";
import { CalenderDataDto } from "./booking.dto";

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
    params: any,
  ): Promise<any> {
    const { endpoint, query } = URLS_AND_QUERY_PARAMS?.BOOKING?.GET?.TASKS;
    const config: AxiosRequestConfig = this.apiService.getConfig(
      `${endpoint(base_url)}${query(params, resource_id)}`,
      HTTPS_METHODS.GET,
      token,
    );
    try {
      const { value }: any = await this.apiService.request(config);

      const responseData: Array<{ ticket_no: string, title: string, priority: string, location: string, responseType: string, building: string, start_time: string, end_time: string, estimated_travel_time: string, total_time: string }> = []

      value.forEach((booking: any) => {
        const { cafm_Case = null, msdyn_workorder } = booking;
        responseData.push({
          ticket_no: cafm_Case?.ticketnumber || null,
          title: cafm_Case?.title || null,
          priority: cafm_Case?.priority || null,
          location: msdyn_workorder?.msdyn_FunctionalLocation?.msdyn_name,
          building: msdyn_workorder?.cafm_Building?.cafm_name,
          start_time: booking?.starttime,
          end_time: booking?.endtime,
          estimated_travel_time: booking?.msdyn_estimatedtravelduration,
          total_time: booking?.duration,
          responseType: msdyn_workorder?.msdyn_workordertype?.msdyn_name,
        })
      });

      return responseData;

    } catch (error) {
      throw error;
    }
  }

  async getTaskCount(
    token: string,
    base_url: string,
    resource_id: string,
  ): Promise<any> {
    try {
      const config: AxiosRequestConfig = this.apiService.getConfig(
        `${base_url}api/data/v9.1/bookableresourcebookings?$filter=_resource_value eq ${resource_id}&$count=true`,
        HTTPS_METHODS.GET,
        token,
      );
      const apiRespnse: any = await this.apiService.request(config);
      return { total: apiRespnse?.['@odata.count'], ...countBookings(apiRespnse?.value) };
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
    const { endpoint, query } = URLS_AND_QUERY_PARAMS?.BOOKING?.GET?.TASKS_FOR_CALENDER;
    const config: AxiosRequestConfig = this.apiService.getConfig(
      `${endpoint(base_url)}${query(date, resource_id)}`,
      HTTPS_METHODS.GET,
      token,
    );
    try {
      const { value }: any = await this.apiService.request(config);
      return FormatDataForCalender(value);
    } catch (error) {
      throw error;
    }
  }
}
