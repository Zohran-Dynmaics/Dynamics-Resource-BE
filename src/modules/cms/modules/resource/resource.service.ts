import { Injectable } from "@nestjs/common";
import { ApiService } from "src/modules/api/api.service";
import { HTTPS_METHODS } from "src/shared/enum";
import { GetResourceSlotsDto } from "./resource.dto";
import { mapGetResourceSlotsDtoToApiObject } from "./resource.mapper";

@Injectable()
export class ResourceService {
  constructor(private apiService: ApiService) {}

  async getBookableResource(
    token: string,
    base_url: string,
    query?: any,
  ): Promise<any> {
    const config = this.apiService.getConfig(
      `${base_url}/api/data/v9.1/bookableresources`,
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

  async getBookableResourceCategories(
    token: string,
    base_url: string,
    query?: any,
  ): Promise<any> {
    const config = this.apiService.getConfig(
      `${base_url}/api/data/v9.1/bookableresourcecategories`,
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

  async getBookableResourceCharacteristics(
    token: string,
    base_url: string,
    query?: any,
  ): Promise<any> {
    const config = this.apiService.getConfig(
      `${base_url}/api/data/v9.1/bookableresourcecharacteristics`,
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

  async getAvailableResourceSlots(
    token: string,
    base_url: string,
    getResourceSlot: GetResourceSlotsDto,
    query?: any,
  ): Promise<any> {
    const config = this.apiService.getConfig(
      `${base_url}/api/data/v9.1/cafm_AvailableResourceSlot`,
      HTTPS_METHODS.POST,
      token,
      query,
      mapGetResourceSlotsDtoToApiObject(getResourceSlot),
    );
    try {
      return await this.apiService.request(config);
    } catch (error) {
      throw error;
    }
  }
}
