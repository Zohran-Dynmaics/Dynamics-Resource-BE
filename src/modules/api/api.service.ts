import { forwardRef, HttpException, Inject, Injectable } from "@nestjs/common";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { HTTPS_METHODS } from "src/shared/enum";
import { CmsService } from "../cms/cms.service";
import { formatCrmError } from "src/shared/utility/utility";

@Injectable()
export class ApiService {
  constructor(
    @Inject(forwardRef(() => CmsService))
    private readonly cmsService: CmsService
  ) {}

  isTokenExpired(error: any) {
    return (
      error.response.status === 401 &&
      (error.response.data.error === "token_expired" ||
        error.response.statusText == "Unauthorized")
    );
  }

  // async request(config: AxiosRequestConfig): Promise<AxiosResponse> {
  //   let response: AxiosResponse = null;
  //   try {
  //     response = await axios.request(config).then((res) => {
  //       return res.data;
  //     });
  //   } catch (error) {
  //     if (this.isTokenExpired(error)) {
  //       const token = await this.cmsService.refreshCrmToken(
  //         config.headers.Authorization.split(" ")[1]
  //       );
  //       config = this.getConfig(
  //         config?.url,
  //         config?.method as HTTPS_METHODS,
  //         token,
  //         config?.params,
  //         config?.data
  //       );
  //       this.request(config);
  //     }
  //     const { message, status } = formatCrmError(error);
  //     throw new HttpException(message, status);
  //   }

  //   return response;
  // }

  async request(config: AxiosRequestConfig): Promise<AxiosResponse> {
    try {
      // Make the initial request
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      if (this.isTokenExpired(error)) {
        // Refresh the token
        const newToken = await this.cmsService.refreshCrmToken(
          config.headers.Authorization.split(" ")[1]
        );

        // Update the configuration with the new token
        config = this.getConfig(
          config?.url,
          config?.method as HTTPS_METHODS,
          newToken,
          config?.params,
          config?.data
        );

        // Retry the request with the updated configuration and return the response
        const retriedResponse = await this.request(config); // Await here
        return retriedResponse.data;
      }

      // If the error is not token expiration, format and throw it
      const { message, status } = formatCrmError(error);
      throw new HttpException(message, status);
    }
  }

  getConfig(
    url: string,
    method: HTTPS_METHODS,
    token: string,
    params?: string,
    data?: any
  ): AxiosRequestConfig {
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${token}`,
        // "Content-Type": "application/json"
        prefer: "return=representation",
        "If-None-Match": ""
      },
      method,
      url,
      params,
      data
    };
    return config;
  }
}
