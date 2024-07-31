import { Injectable } from "@nestjs/common";
import { AxiosRequestConfig } from "axios";
import { ApiService } from "src/modules/api/api.service";
import { HTTPS_METHODS } from "src/shared/enum";
import { PROBLEM_ISSUES_ENDPOINTS } from "./problem-issue.contant";

@Injectable()
export class ProblemIssueService {
  constructor(private apiService: ApiService) { }

  async getAllProblemIssues(
    token: string,
    base_url: string,
    query?: any,
  ): Promise<any> {
    const { endpoint, searchQuery } = PROBLEM_ISSUES_ENDPOINTS.ALL_PROBLEM_ISSUES;
    const config: AxiosRequestConfig = this.apiService.getConfig(
      `${endpoint(base_url)}`,
      HTTPS_METHODS.GET,
      token,
      searchQuery(query) as string,
    );
    try {
      return await this.apiService.request(config);
    } catch (error) {
      throw error;
    }
  }
}
