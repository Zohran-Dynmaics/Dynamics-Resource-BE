import { Controller, Get, Query, Req } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { CustomRequest } from 'src/shared/custom-interface';
import { query } from 'express';

@Controller('openai')
export class OpenaiController {
    constructor(private readonly openaiService: OpenaiService) { }

    @Get()
    async getOpenAiFunctionCallResponse(@Query() query: any) {
        const { question } = query;
        return await this.openaiService.generateAnswer(question);
    }
}
