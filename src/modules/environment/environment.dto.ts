import { IsNotEmpty, IsOptional } from "class-validator";
import { GetCrmTokenDto } from "../cms/cms.dto";

export class CreateEnvironmentDto extends GetCrmTokenDto {
  @IsNotEmpty({ message: "Environment Name is required" })
  env_name: string;

  @IsOptional()
  token: string;
}

export class UpdateEnvironmentDto extends CreateEnvironmentDto {
  @IsNotEmpty({ message: "Environment Id is required" })
  _id: string;
}
