import { Injectable } from "@nestjs/common";
import { ApiService } from "src/modules/api/api.service";
import { HTTPS_METHODS } from "src/shared/enum";
import { CreateIncidentDto } from "./incident.dto";

@Injectable()
export class IncidentService {
    constructor(private apiService: ApiService) { }

    async getIncident(
        token: string,
        base_url: string,
        incident_id: string,
        query?: any,
    ): Promise<any> {
        const config = this.apiService.getConfig(
            `${base_url}api/data/v9.1/incidents(${incident_id})?`,
            HTTPS_METHODS.GET,
            token,
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
        const config = this.apiService.getConfig(
            `${base_url}/api/data/v9.1/incidents`,
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
}
