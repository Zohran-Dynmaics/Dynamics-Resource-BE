import { HttpException, Injectable } from "@nestjs/common";
import { AxiosRequestConfig } from "axios";
import { ApiService } from "src/modules/api/api.service";
import { HTTPS_METHODS } from "src/shared/enum";
import { formatContactList } from "./utility";

@Injectable()
export class ContactService {
  constructor(private apiService: ApiService) { }

  async getContact(
    token: string,
    base_url: string,
    contact_id: string,
    query?: any,
  ): Promise<any> {
    const config: AxiosRequestConfig = this.apiService.getConfig(
      `${base_url}api/data/v9.1/contacts(${contact_id})?`,
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

  async getAllContacts(
    token: string,
    base_url: string,
    query?: any,
  ): Promise<any> {
    const config: AxiosRequestConfig = this.apiService.getConfig(
      `${base_url}api/data/v9.1/contacts?`,
      HTTPS_METHODS.GET,
      token,
      query,
    );
    try {
      const { value }: any = await this.apiService.request(config);
      return formatContactList(value);
    } catch (error) {
      throw error;
    }
  }
}
