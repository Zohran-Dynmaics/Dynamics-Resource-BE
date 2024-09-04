import {
  IsOptional,
  IsString,
  IsNumber,
  IsEnum,
  IsDate,
  IsNotEmpty
} from "class-validator";

export enum PromoType {
  PERCENTAGE = "PERCENTAGE",
  FIXED = "FIXED"
}

export enum PromoStatusType {
  ACTIVE = "Active",
  EXPIRED = "Expired"
}

export class CreatePromoCode {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  limit?: string;

  @IsOptional()
  @IsEnum(PromoType)
  type?: PromoType;

  @IsOptional()
  @IsString()
  value?: number;

  @IsOptional()
  @IsString()
  max_discount?: number;

  @IsOptional()
  @IsString()
  min_order?: number;

  @IsOptional()
  @IsString()
  start_date?: Date;

  @IsOptional()
  @IsString()
  end_date?: Date;

  @IsOptional()
  @IsString({ each: true })
  users?: string[];

  @IsOptional()
  @IsString({ each: true })
  categories?: string[];

  @IsOptional()
  @IsString({ each: true })
  products_services?: string[];

  @IsOptional()
  @IsString({ each: true })
  accounts?: string[];
}

export class ValidatePromoCode {
  @IsString()
  @IsNotEmpty()
  promocode: string;

  @IsNumber()
  @IsNotEmpty()
  orderAmount: number;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  product_service?: string;

  @IsString()
  @IsOptional()
  account?: string;
}
