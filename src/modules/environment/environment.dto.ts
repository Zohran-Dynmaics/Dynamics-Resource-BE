import { IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { GetCrmTokenDto } from "../cms/cms.dto";

export class CreateEnvironmentDto extends GetCrmTokenDto {
  @IsNotEmpty({ message: "Environment Name is required" })
  env_name: string;

  @IsOptional()
  token: string;
}

export class UpdateEnvironmentDto {
  @IsMongoId({ message: "Environment Id is required" })
  _id: string;

  @IsOptional()
  @IsString()
  env_name?: string;

  @IsOptional()
  @IsString()
  client_id?: string;

  @IsOptional()
  @IsString()
  client_secret?: string;

  @IsOptional()
  @IsString()
  tenant_id?: string;

  @IsOptional()
  @IsString()
  base_url?: string;

  @IsOptional()
  @IsString()
  token?: string;
}
