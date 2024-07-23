import { Injectable } from "@nestjs/common";
import { AxiosRequestConfig } from "axios";
import { response } from "express";
import * as moment from "moment";
import { ApiService } from "src/modules/api/api.service";
import { URLS_AND_QUERY_PARAMS } from "src/shared/constant";
import { HTTPS_METHODS } from "src/shared/enum";
import { countBookings } from "./utility";

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
    query: any,
  ): Promise<any> {
    const config: AxiosRequestConfig = this.apiService.getConfig(
      `${base_url}api/data/v9.1/bookableresourcebookings`,
      HTTPS_METHODS.GET,
      token,
      query
    );
    try {
      return await this.apiService.request(config);
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
}
