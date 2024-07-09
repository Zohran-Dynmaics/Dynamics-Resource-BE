import { IsNotEmpty, IsOptional } from "class-validator";

export class GetCrmTokenDto {
  @IsNotEmpty({ message: "Tenant Id is required" })
  tenant_id: string;

  @IsNotEmpty({ message: "Base Url / Resource environment is required." })
  base_url: string;

  @IsNotEmpty({ message: "Client Id is required." })
  client_id: string;

  @IsNotEmpty({ message: "Client Secret is required." })
  client_secret: string;
}

export class GetCrmTokenResponseDto {
  @IsOptional()
  token_type?: string;

  @IsOptional()
  expires_in?: string;

  @IsOptional()
  ext_expires_in?: string;

  @IsOptional()
  expires_on?: string;

  @IsOptional()
  not_before?: string;

  @IsOptional()
  resource?: string;

  @IsNotEmpty({ message: "Access Token is required." })
  access_token?: string;
}
