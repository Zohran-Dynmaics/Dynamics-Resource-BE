import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";

import { CustomRequest } from "src/shared/custom-interface";
import { IncidentService } from "./incident.service";
import { CreateIncidentDto } from "./incident.dto";

@Controller("cms/incident")
export class IncidentController {
  constructor(private incidentService: IncidentService) { }

  @Get("/:incident_id")
  async getIncident(@Req() req: CustomRequest): Promise<any> {
    const { env, params, query } = req;
    try {
      return await this.incidentService.getIncident(
        env.token,
        env.base_url,
        params.incident_id,
        query,
      );
    } catch (error) {
      throw error;
    }
  }

  @Post("")
  async createIncident(
    @Req() req: CustomRequest,
    @Body() createIncidentDto: CreateIncidentDto,
  ): Promise<any> {
    const { env } = req;
    return await this.incidentService.createIncident(
      env.token,
      env.base_url,
      createIncidentDto,
    );
  }
}
