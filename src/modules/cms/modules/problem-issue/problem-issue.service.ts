import { Injectable } from "@nestjs/common";
import { AxiosRequestConfig } from "axios";
import { ApiService } from "src/modules/api/api.service";
import { HTTPS_METHODS } from "src/shared/enum";

@Injectable()
export class ProblemIssueService {
    constructor(private apiService: ApiService) { }

    async getAllProblemIssues(
        token: string,
        base_url: string,
        query?: any
    ): Promise<any> {
        const config: AxiosRequestConfig = this.apiService.getConfig(
            `${base_url}api/data/v9.1/cafm_problemissues`,
            HTTPS_METHODS.GET,
            token,
            query
        );
        try {
            return await this.apiService.request(config);
        } catch (error) {
            throw error;
        }
    }
}
