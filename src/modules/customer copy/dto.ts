import {
  IsBoolean,
  IsEmail,
  isNotEmpty,
  IsNotEmpty,
  IsOptional,
  IsString
} from "class-validator";

export class CreateCustomer {
  @IsNotEmpty()
  @IsBoolean()
  isNewCustomer: boolean;

  @IsString()
  @IsOptional()
  fullName: string;

  @IsString()
  @IsOptional()
  email: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsOptional()
  area?: string;

  @IsString()
  @IsOptional()
  building?: string;

  @IsString()
  @IsOptional()
  apartment?: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  address?: string;
}

export class CustomerLogin {
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  device?: string;

  @IsOptional()
  @IsString()
  appName?: string;
}

export class UpdatePassword {
  @IsNotEmpty()
  @IsString()
  currentPassword: string;

  @IsNotEmpty()
  @IsString()
  newPassword: string;
}

export class UpdateCustomerDto {
  @IsOptional()
  @IsString()
  fullname?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEmail()
  mobilephone?: string;
}
