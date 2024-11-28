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
  UpdateBookableResourceDto
} from "./cms.dto";
import { GRANT_TYPES } from "./constants";
import { TokenEnvironmentDto } from "../admin/environment/environment.dto";
import { TokenUserDto } from "../users/users.dto";
import { BookingService } from "./modules/booking/booking.service";
import { FilterType, TaskFilterDto } from "./modules/booking/booking.dto";

@Injectable()
export class CmsService {
  constructor(
    @Inject(forwardRef(() => ApiService)) private apiService: ApiService,
    private envService: EnvironmentService,
    private bookingService: BookingService
  ) {}

  async getCrmToken(
    getCrmTokenDto: GetCrmTokenDto
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
      grant_type: GRANT_TYPES.CLIENT_CREDENTIALS
    });

    const config: AxiosRequestConfig = {
      data,
      method: "POST",
      url: `${process.env.MICROSOFT_LOGIN_BASE_URL}${tenant_id}/oauth2/token`,
      headers: {
        "Content-Type": "multipart/form-data"
      }
    };

    try {
      const response: any = await this.apiService.request(config);
      await this.envService.update({
        _id: env?._id,
        env_name: env?.env_name.toLowerCase(),
        token: response?.access_token
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
        Authorization: `Bearer ${env.token}`
      },
      method: "GET",
      url: `${process.env.RESOURCE}/api/data/v9.1/bookableresourcecategories`
    };

    try {
      return await this.apiService.request(config);
    } catch (error) {
      throw error;
    }
  }

  async getBookableResources(token: string, base_url: string): Promise<any> {
    const config: AxiosRequestConfig = this.apiService.getConfig(
      `${base_url}/api/data/v9.1/bookableresources?$expand=plus_department($select=plus_name),plus_warehouseid($select=msdyn_name;$expand=plus_parentwarehouse),msdyn_bookableresource_msdyn_requirementresourcepreference_BookableResource($select=msdyn_name;$expand=msdyn_Account($select=name)),UserId($select=fullname,caltype,isintegrationuser,islicensed;$expand=defaultmailbox($select=emailaddress))`,
      HTTPS_METHODS.GET,
      token
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
    updateBookableResourceDto: UpdateBookableResourceDto
  ): Promise<any> {
    const config: AxiosRequestConfig = this.apiService.getConfig(
      `${base_url}api/data/v9.1/bookableresources(${resourceId}) `,
      HTTPS_METHODS.PATCH,
      token,
      null,
      updateBookableResourceDto
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

  async getHomeScreenData(
    env: TokenEnvironmentDto,
    user: TokenUserDto
  ): Promise<any> {
    try {
      const { token, base_url } = env;
      const { bookableresourceid } = user;
      const returnData: any = {
        reactiveCount: 0,
        todayPpm: 0,
        totalPpm: 0,
        taskCount: 0,
        rating: 0
      };

      // const [taskCount, reactiveCount, todayPpm, totalPpm]: any =
      //   await Promise.all([
      //     this.bookingService.getTasksOfDay(
      //       token,
      //       base_url,
      //       bookableresourceid,
      //       null,
      //       "$filter=_bookingstatus_value ne bb4acc71-8179-ef11-ac21-7c1e5236f34e and (msdyn_workorder/_msdyn_workordertype_value ne 766b493d-7442-ef11-a316-7c1e52353674 and msdyn_workorder/msdyn_systemstatus ne 690970003)"
      //     ),
      //     this.bookingService.getTasksOfDay(
      //       token,
      //       base_url,
      //       bookableresourceid,
      //       {
      //         filter: FilterType.today
      //         // workordertype: "150032b3-b579-ef11-ac20-7c1e52366543"
      //       } as TaskFilterDto,
      //       "$fiter=msdyn_workorder/_msdyn_workordertype_value eq 150032b3-b579-ef11-ac20-7c1e52366543"
      //     ),
      //     this.bookingService.getTasksOfDay(
      //       token,
      //       base_url,
      //       bookableresourceid,
      //       { filter: FilterType.today },
      //       "$filter=_plus_case_value eq null and _resource_value eq 7b36ba8c-688c-ef11-8a6a-002248cb3595 and _bookingstatus_value ne 0adbf4e6-86cc-4db0-9dbb-51b7d1ed4020 and _bookingstatus_value ne c33410b9-1abe-4631-b4e9-6e4a1113af34 and msdyn_workorder/_msdyn_workordertype_value eq 766b493d-7442-ef11-a316-7c1e52353674"
      //       // "$expand=msdyn_workorder($select=msdyn_name,_msdyn_workordertype_value)&$filter=_resource_value eq 7b36ba8c-688c-ef11-8a6a-002248cb3595 and _plus_case_value eq null and _bookingstatus_value ne 0adbf4e6-86cc-4db0-9dbb-51b7d1ed4020 and _bookingstatus_value ne c33410b9-1abe-4631-b4e9-6e4a1113af34 and msdyn_workorder/_msdyn_workordertype_value eq 766b493d-7442-ef11-a316-7c1e52353674&$count=true"
      //       // "$filter=_plus_case_value eq null and bookingstatus_value ne 0adbf4e6-86cc-4db0-9dbb-51b7d1ed4020 and _bookingstatus_value ne c33410b9-1abe-4631-b4e9-6e4a1113af34 and msdyn_workorder/_msdyn_workordertype_value eq 766b493d-7442-ef11-a316-7c1e52353674"
      //     ),
      //     this.bookingService.getTasksOfDay(
      //       token,
      //       base_url,
      //       bookableresourceid,
      //       null,
      //       "$filter=_plus_case_value eq null and _resource_value eq 7b36ba8c-688c-ef11-8a6a-002248cb3595 and _bookingstatus_value ne 0adbf4e6-86cc-4db0-9dbb-51b7d1ed4020 and _bookingstatus_value ne c33410b9-1abe-4631-b4e9-6e4a1113af34 and msdyn_workorder/_msdyn_workordertype_value eq 766b493d-7442-ef11-a316-7c1e52353674"
      //     )
      //   ]);

      /**
       *  Booking Statuses
       *    1. Completed = c33410b9-1abe-4631-b4e9-6e4a1113af34
       *    2. Cancelled = 0adbf4e6-86cc-4db0-9dbb-51b7d1ed4020
       *    3. Partially Completed = bb4acc71-8179-ef11-ac21-7c1e5236f34e
       *
       */

      const [taskCount, reactiveCount, todayPpm, totalPpm]: any =
        await Promise.all([
          this.bookingService.getHomeScreenStats(
            token,
            base_url,
            bookableresourceid,
            null,
            "$filter=_bookingstatus_value ne bb4acc71-8179-ef11-ac21-7c1e5236f34e and _bookingstatus_value ne 0adbf4e6-86cc-4db0-9dbb-51b7d1ed4020 and _bookingstatus_value ne c33410b9-1abe-4631-b4e9-6e4a1113af34 and (msdyn_workorder/_msdyn_workordertype_value ne 766b493d-7442-ef11-a316-7c1e52353674 and msdyn_workorder/msdyn_systemstatus ne 690970003)"
          ),
          this.bookingService.getHomeScreenStats(
            token,
            base_url,
            bookableresourceid,
            {
              filter: FilterType.today,
              workordertype: "150032b3-b579-ef11-ac20-7c1e52366543"
            } as TaskFilterDto
          ),
          this.bookingService.getHomeScreenStats(
            token,
            base_url,
            bookableresourceid,
            { filter: FilterType.today },
            // _plus_case_value eq null  and
            "$filter=_bookingstatus_value ne 0adbf4e6-86cc-4db0-9dbb-51b7d1ed4020 and _bookingstatus_value ne bb4acc71-8179-ef11-ac21-7c1e5236f34e and _bookingstatus_value ne c33410b9-1abe-4631-b4e9-6e4a1113af34 and msdyn_workorder/_msdyn_workordertype_value eq 766b493d-7442-ef11-a316-7c1e52353674"
          ),
          this.bookingService.getHomeScreenStats(
            token,
            base_url,
            bookableresourceid,
            null,
            "$filter=_bookingstatus_value ne 0adbf4e6-86cc-4db0-9dbb-51b7d1ed4020 and _bookingstatus_value ne c33410b9-1abe-4631-b4e9-6e4a1113af34 and _bookingstatus_value ne bb4acc71-8179-ef11-ac21-7c1e5236f34e and msdyn_workorder/_msdyn_workordertype_value eq 766b493d-7442-ef11-a316-7c1e52353674"
          )
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

  async getDynamicContent(
    base_url: string,
    token: string,
    dynamic_endpoint: string
  ): Promise<any> {
    try {
      const config: AxiosRequestConfig = this.apiService.getConfig(
        `${base_url}api/data/v9.1/${dynamic_endpoint}`,
        HTTPS_METHODS.GET,
        token
      );
      console.log("🚀 ~ CmsService ~ config:", config);
      return this.apiService.request(config);
    } catch (error) {
      throw error;
    }
  }

  async CreateOrUpdateDynamicContent(
    base_url: string,
    token: string,
    dynamic_endpoint: string,
    method: HTTPS_METHODS,
    data?: any,
    query?: any
  ): Promise<any> {
    try {
      const config: AxiosRequestConfig = this.apiService.getConfig(
        `${base_url}api/data/v9.1/${dynamic_endpoint}`,
        method,
        token,
        query,
        data
      );
      return this.apiService.request(config);
    } catch (error) {
      throw error;
    }
  }
}
