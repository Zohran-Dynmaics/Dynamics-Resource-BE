import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { GetCrmTokenDto, GetCrmTokenResponseDto } from "./cms.dto";
import { ApiService } from "../api/api.service";
import { AxiosRequestConfig } from "axios";
import { GRANT_TYPES } from "./constants";
import { jwtDecode } from "jwt-decode";
import { createFormData } from "src/shared/utility";
import { EnvironmentService } from "../environment/environment.service";

@Injectable()
export class CmsService {
  constructor(
    @Inject(forwardRef(() => ApiService)) private apiService: ApiService,
    private envService: EnvironmentService,
  ) {}

  async getCrmToken(
    getCrmTokenDto: GetCrmTokenDto,
  ): Promise<GetCrmTokenResponseDto> {
    const { base_url, client_id, client_secret, tenant_id } = getCrmTokenDto;
    const data: FormData = createFormData({
      resource: base_url,
      client_id,
      client_secret,
      grant_type: GRANT_TYPES.CLIENT_CREDENTIALS,
    });

    const config: AxiosRequestConfig = {
      data,
      method: "POST",
      url: `${process.env.MICROSOFT_LOGIN_BASE_URL}/${tenant_id}/oauth2/token`,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      const response = await this.apiService.request(config);
      return response as GetCrmTokenResponseDto;
    } catch (error) {
      throw error;
    }
  }

  async getBookableResourceCategories(token: string): Promise<any> {
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${token}`,
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

  async getBookableResources(token: string): Promise<any> {
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: "GET",
      url: `${process.env.RESOURCE}/api/data/v9.1/bookableresources?$select=cafm_username,cafm_password`,
    };
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
