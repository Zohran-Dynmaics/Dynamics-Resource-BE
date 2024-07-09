import { forwardRef, HttpException, Inject, Injectable } from "@nestjs/common";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { HTTPS_METHODS } from "src/shared/enum";
import { formatCrmError } from "src/shared/utility";
import { CmsService } from "../cms/cms.service";

@Injectable()
export class ApiService {
  constructor(
    @Inject(forwardRef(() => CmsService))
    private readonly cmsService: CmsService,
  ) {}

  isTokenExpired(error: any) {
    return (
      error.response.status === 401 &&
      (error.response.data.error === "token_expired" ||
        error.response.statusText == "Unauthorized")
    );
  }

  async request(config: AxiosRequestConfig): Promise<AxiosResponse> {
    let response: AxiosResponse = null;
    try {
      response = await axios.request(config).then((response) => response.data);
    } catch (error) {
      const { message, status } = formatCrmError(error);
      throw new HttpException(message, status);
    }

    return response;
  }

  getConfig(
    url: string,
    method: HTTPS_METHODS,
    token: string,
    params?: string,
    data?: any,
  ): AxiosRequestConfig {
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method,
      url,
      params,
      data,
    };
    return config;
  }
}
