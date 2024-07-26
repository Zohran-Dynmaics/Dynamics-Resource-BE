import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { AxiosRequestConfig } from "axios";
import { jwtDecode } from "jwt-decode";
import { Types } from "mongoose";
import { HTTPS_METHODS } from "src/shared/enum";
import { createFormData } from "src/shared/utility/utility";
import { ApiService } from "../api/api.service";
import { EnvironmentService } from "../environment/environment.service";
import {
  GetCrmTokenDto,
  GetCrmTokenResponseDto,
  UpdateBookableResourceDto,
} from "./cms.dto";
import { GRANT_TYPES } from "./constants";

@Injectable()
export class CmsService {
  constructor(
    @Inject(forwardRef(() => ApiService)) private apiService: ApiService,
    private envService: EnvironmentService,
  ) { }

  async getCrmToken(
    getCrmTokenDto: GetCrmTokenDto,
  ): Promise<GetCrmTokenResponseDto> {
    const { base_url, client_id, client_secret, tenant_id } = getCrmTokenDto;
    //("🚀 ~ CmsService ~ base_url:", base_url)
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
      `${base_url}/api/data/v9.1/bookableresources?$select=name,plus_password,plus_username`,
      HTTPS_METHODS.GET,
      token,
    );
    try {
      //("🚀 ~ CmsService ~ getBookableResources ~ config:", config)
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
}
