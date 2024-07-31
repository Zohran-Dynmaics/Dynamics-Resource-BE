import { HttpException, Injectable } from "@nestjs/common";
import { AxiosRequestConfig } from "axios";
import { ApiService } from "src/modules/api/api.service";
import { HTTPS_METHODS } from "src/shared/enum";
import { formatContactList } from "./contact.utility";
import { CONTACTS_ENDPOINTS } from "./contact.constant";

@Injectable()
export class ContactService {
  constructor(private apiService: ApiService) { }

  async getContact(
    token: string,
    base_url: string,
    contact_id: string,
    query?: any,
  ): Promise<any> {
    const { endpoint, searchQuery } = CONTACTS_ENDPOINTS.CONTACT;
    const config: AxiosRequestConfig = this.apiService.getConfig(
      `${endpoint(base_url, contact_id)}`,
      HTTPS_METHODS.GET,
      token,
      query ?? searchQuery as string,
    );
    try {
      return await this.apiService.request(config);
    } catch (error) {
      throw error;
    }
  }

  async getAllContacts(
    token: string,
    base_url: string,
    query?: any,
  ): Promise<any> {
    const { endpoint, searchQuery } = CONTACTS_ENDPOINTS.ALL_CONTACTS;
    const config: AxiosRequestConfig = this.apiService.getConfig(
      `${endpoint(base_url)}`,
      HTTPS_METHODS.GET,
      token,
      query ?? searchQuery as string,
    );
    try {
      const value: any = await this.apiService.request(config);
      return formatContactList(value?.value);
      // return value;
    } catch (error) {
      throw error;
    }
  }

  async patchContact(
    token: string,
    base_url: string,
    contact_id: string,
    data: any,
  ): Promise<any> {

    const { endpoint } = CONTACTS_ENDPOINTS.CONTACT;

    const config: AxiosRequestConfig = this.apiService.getConfig(
      `${endpoint(base_url, contact_id)}`,
      HTTPS_METHODS.GET,
      token,
      null,
      data,
    );

    try {
      return await this.apiService.request(config);
    } catch (error) {
      throw error;
    }
  }
}
