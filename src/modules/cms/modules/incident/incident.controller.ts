import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";

import { CustomRequest } from "src/shared/custom-interface";
import { IncidentService } from "./incident.service";
import { CreateIncidentDto } from "./incident.dto";

@Controller("cms/incidents")
export class IncidentController {
  constructor(private incidentService: IncidentService) { }

  @Get("")
  async getIncidents(@Req() req: CustomRequest): Promise<any> {
    const { env, query } = req;
    try {
      return await this.incidentService.getIncidents(
        env.token,
        env.base_url,
        query,
      );
    } catch (error) {
      throw error;
    }
  }

  @Get(":incident_id")
  async getIncidentWithId(@Req() req: CustomRequest): Promise<any> {
    const { env, params, query } = req;
    try {
      return await this.incidentService.getIncidentWithId(
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
    try {
      const { env } = req;
      return await this.incidentService.createIncident(
        env.token,
        env.base_url,
        createIncidentDto,
      );
    } catch (error) {
      throw error;
    }
  }

  @Patch(":incident_id")
  async updateIncident(
    @Req() req: CustomRequest,
    @Body() updateIncidentDto: any,
  ): Promise<any> {
    try {
      const { env, params } = req;
      return await this.incidentService.patchIncident(
        env.token,
        env.base_url,
        params.incident_id,
        updateIncidentDto,
      );
    } catch (error) {
      throw error;
    }
  }
}
