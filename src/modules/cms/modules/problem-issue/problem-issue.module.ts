import { forwardRef, Module } from "@nestjs/common";
import { ProblemIssueController } from "./problem-issue.controller";
import { ProblemIssueService } from "./problem-issue.service";
import { ApiModule } from "src/modules/api/api.module";

@Module({
  imports: [forwardRef(() => ApiModule)],
  controllers: [ProblemIssueController],
  providers: [ProblemIssueService]
})
export class ProblemIssueModule {}
