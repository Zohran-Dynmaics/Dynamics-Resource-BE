import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { EnvironmentService } from "./environment.service";

import { CreateEnvironmentDto } from "./environment.dto";

@Controller("env")
export class EnvironmentController {
  constructor(private readonly environmentService: EnvironmentService) { }

  @Post("create")
  async create(@Body() createEnvDto: CreateEnvironmentDto) {
    return await this.environmentService.create(createEnvDto);
  }
}
