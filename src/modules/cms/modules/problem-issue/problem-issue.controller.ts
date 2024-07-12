import { Controller, Get } from '@nestjs/common';
import { ProblemIssueService } from './problem-issue.service';
import { Req } from '@nestjs/common';
import { CustomRequest } from 'src/shared/custom-interface';

@Controller('cms/problem-issue')
export class ProblemIssueController {
    constructor(private problemIssueService: ProblemIssueService) { }

    @Get('all')
    getAllProblemIssues(@Req() req: CustomRequest): Promise<any> {
        const { env, query } = req;
        return this.problemIssueService.getAllProblemIssues(env.token, env.base_url, query);
    }

}
