import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { AxiosRequestConfig } from "axios";
import { jwtDecode } from "jwt-decode";
import { Types } from "mongoose";
import { HTTPS_METHODS } from "src/shared/enum";
import { createFormData } from "src/shared/utility/utility";
import { ApiService } from "../api/api.service";
import { EnvironmentService } from "../admin/environment/environment.service";
import {
  GetCrmTokenDto,
  GetCrmTokenResponseDto,
  UpdateBookableResourceDto,
} from "./cms.dto";
import { GRANT_TYPES } from "./constants";
import { TokenEnvironmentDto } from "../admin/environment/environment.dto";
import { TokenUserDto } from "../admin/users/users.dto";
import { BookingService } from "./modules/booking/booking.service";
import { FilterType, TaskFilterDto } from "./modules/booking/booking.dto";

@Injectable()
export class CmsService {
  constructor(
    @Inject(forwardRef(() => ApiService)) private apiService: ApiService,
    private envService: EnvironmentService,
    private bookingService: BookingService,
  ) { }

  async getCrmToken(
    getCrmTokenDto: GetCrmTokenDto,
  ): Promise<GetCrmTokenResponseDto> {
    const { base_url, client_id, client_secret, tenant_id } = getCrmTokenDto;
    const env = await this.envService.findByBaseUrl(base_url);
    if (!env) {
      throw new Error("Environment not found");
    }
    const data: FormData = createFormData({
      resource: base_url,
      client_id,
      client_secret,
      grant_type: GRANT_TYPES.CLIENT_CREDENTIALS,
    });

    const config: AxiosRequestConfig = {
      data,
      method: "POST",
      url: `${process.env.MICROSOFT_LOGIN_BASE_URL}${tenant_id}/oauth2/token`,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      const response: any = await this.apiService.request(config);
      await this.envService.update({
        _id: env?._id,
        env_name: env?.env_name.toLowerCase(),
        token: response?.access_token,
      });
      return response as GetCrmTokenResponseDto;
    } catch (error) {
      throw error;
    }
  }

  async getBookableResourceCategories(env_id: Types.ObjectId): Promise<any> {
    const env = await this.envService.findById(env_id);
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${env.token}`,
      },
      method: "GET",
      url: `${process.env.RESOURCE}/api/data/v9.1/bookableresourcecategories`,
    };

    try {
      return await this.apiService.request(config);
    } catch (error) {
      throw error;
    }
  }

  async getBookableResources(token: string, base_url: string): Promise<any> {
    const config: AxiosRequestConfig = this.apiService.getConfig(
      `${base_url}/api/data/v9.1/bookableresources?$select=name,plus_password,plus_username&$expand=UserId($select=fullname,caltype,isintegrationuser,islicensed;$expand=defaultmailbox($select=emailaddress))`,
      HTTPS_METHODS.GET,
      token,
    );
    try {
      return await this.apiService.request(config);
    } catch (error) {
      throw error;
    }
  }

  async updateBookaableResource(
    token: string,
    base_url: string,
    resourceId: string,
    updateBookableResourceDto: UpdateBookableResourceDto,
  ): Promise<any> {
    const config: AxiosRequestConfig = this.apiService.getConfig(
      `${base_url}api/data/v9.1/bookableresources(${resourceId}) `,
      HTTPS_METHODS.PATCH,
      token,
      null,
      updateBookableResourceDto,
    );
    try {
      return await this.apiService.request(config);
    } catch (error) {
      throw error;
    }
  }

  async refreshCrmToken(expiredToken: string): Promise<string> {
    try {
      const decodedToken: any = jwtDecode(expiredToken);
      const env = await this.envService.findByBaseUrl(decodedToken.aud);
      return (await this.getCrmToken(env)).access_token;
    } catch (error) {
      throw error;
    }
  }

  async getHomeScreenData(env: TokenEnvironmentDto, user: TokenUserDto): Promise<any> {
    try {
      const { token, base_url } = env;
      const { bookableresourceid } = user;
      const returnData: any = {
        reactiveCount: 0,
        todayPpm: 0,
        totalPpm: 0,
        taskCount: 0,
        rating: 0
      }

      const [taskCount, reactiveCount, todayPpm, totalPpm]: any = await Promise.all([
        this.bookingService.getTasksOfDay(token, base_url, bookableresourceid),
        this.bookingService.getTasksOfDay(token, base_url, bookableresourceid, { filter: FilterType.today, workordertype: "bc8d5111-b548-ef11-a316-6045bd14a33f" } as TaskFilterDto),
        this.bookingService.getTasksOfDay(token, base_url, bookableresourceid, { filter: FilterType.today }, "$filter=_plus_case_value eq null"),
        this.bookingService.getTasksOfDay(token, base_url, bookableresourceid, null, "$filter=_plus_case_value eq null")
      ]);

      returnData.reactiveCount = reactiveCount?.length ?? 0;
      returnData.taskCount = taskCount?.length ?? 0;
      returnData.todayPpm = todayPpm?.length ?? 0;
      returnData.totalPpm = totalPpm?.length ?? 0;


      return returnData;

    } catch (error) {
      throw error;
    }
  }

  async getDynamicContent(base_url: string, token: string, dynamic_endpoint: string): Promise<any> {
    try {
      const config: AxiosRequestConfig = this.apiService.getConfig(
        `${base_url}api/data/v9.1/${dynamic_endpoint}`,
        HTTPS_METHODS.GET,
        token,
      );
      return this.apiService.request(config);
    } catch (error) {
      throw error;
    }
  }

  async CreateOrUpdateDynamicContent(base_url: string, token: string, dynamic_endpoint: string, method: HTTPS_METHODS, data?: any): Promise<any> {
    try {
      const config: AxiosRequestConfig = this.apiService.getConfig(
        `${base_url}api/data/v9.1/${dynamic_endpoint}`,
        method,
        token,
        null,
        data
      );
      console.log("🚀 ~ CmsService ~ CreateOrUpdateDynamicContent ~ config:", config)
      return this.apiService.request(config);
    } catch (error) {
      console.log("🚀 ~ CmsService ~ CreateOrUpdateDynamicContent ~ error:", error)
      throw error;
    }
  }


}
