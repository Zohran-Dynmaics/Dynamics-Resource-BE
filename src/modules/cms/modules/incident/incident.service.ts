import { Injectable } from "@nestjs/common";
import { ApiService } from "src/modules/api/api.service";
import { HTTPS_METHODS } from "src/shared/enum";
import { CreateIncidentDto } from "./incident.dto";
import { CONTACTS_ENDPOINTS } from "./constant";

@Injectable()
export class IncidentService {
  constructor(private apiService: ApiService) { }

  async getIncidents(
    token: string,
    base_url: string,
    query?: any,
  ): Promise<any> {
    const { endpoint, searchQuery } = CONTACTS_ENDPOINTS.ALL_INCIDENTS;
    const config = this.apiService.getConfig(
      `${endpoint(base_url)}`,
      HTTPS_METHODS.GET,
      token,
      query || searchQuery as string,
    );
    try {
      return this.apiService.request(config);
    } catch (error) {
      throw error;
    }
  }

  async getIncidentWithId(
    token: string,
    base_url: string,
    incident_id: string,
    query?: any,
  ): Promise<any> {
    const { endpoint, searchQuery } = CONTACTS_ENDPOINTS.INCIDENT;
    const config = this.apiService.getConfig(
      `${endpoint(base_url, incident_id)}`,
      HTTPS_METHODS.GET,
      token,
      query || searchQuery as string,
    );
    try {
      return this.apiService.request(config);
    } catch (error) {
      throw error;
    }
  }

  async createIncident(
    token: string,
    base_url: string,
    createIncidentDto: CreateIncidentDto,
  ): Promise<any> {
    const { endpoint } = CONTACTS_ENDPOINTS.CREATE_INCIDENT;
    const config = this.apiService.getConfig(
      `${endpoint(base_url)}`,
      HTTPS_METHODS.POST,
      token,
      null,
      createIncidentDto,
    );
    try {
      return this.apiService.request(config);
    } catch (error) {
      throw error;
    }
  }

  async patchIncident(
    token: string,
    base_url: string,
    incident_id: string,
    updateIncidentDto: any,
  ): Promise<any> {
    const { endpoint } = CONTACTS_ENDPOINTS.INCIDENT;
    const config = this.apiService.getConfig(
      `${endpoint(base_url, incident_id)}`,
      HTTPS_METHODS.PATCH,
      token,
      null,
      updateIncidentDto,
    );
    try {
      return this.apiService.request(config);
    } catch (error) {
      throw error;
    }
  }
}
