import { Injectable } from "@nestjs/common";
import { AxiosRequestConfig } from "axios";
import { ApiService } from "src/modules/api/api.service";
import { HTTPS_METHODS } from "src/shared/enum";

@Injectable()
export class WorkOrderService {
  constructor(private apiService: ApiService) {}

  async getWorkOrderTypes(token: string, base_url: string): Promise<any> {
    const config: AxiosRequestConfig = this.apiService.getConfig(
      `${base_url}api/data/v9.1/msdyn_workordertypes?$select=msdyn_name`,
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
