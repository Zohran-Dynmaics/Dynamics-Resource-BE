import {
  IsBoolean,
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString
} from "class-validator";
import { Schema, Types } from "mongoose";

export class UpdateUserDto {
  @IsMongoId({ message: "Invalid Object Id." })
  _id: Types.ObjectId;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  account?: string;

  @IsOptional()
  @IsString()
  accountId?: string;

  @IsOptional()
  @IsString()
  plusWarehouseId?: string;

  @IsOptional()
  @IsString()
  plusWarehouseName?: string;

  @IsOptional()
  @IsString()
  plusParentWarehouseName?: string;

  @IsOptional()
  @IsString()
  plusParentWarehouseId?: string;

  @IsOptional()
  @IsBoolean()
  resetPasswordRequested?: boolean;

  @IsOptional()
  @IsString()
  project?: string;
}

export class SearchUserDto {
  @IsOptional()
  @IsMongoId()
  _id?: string | Types.ObjectId;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  projectId?: string;
}

export class TokenUserDto {
  @IsMongoId()
  @IsNotEmpty()
  _id: Types.ObjectId;

  @IsEmail({}, { message: "Invalid Email." })
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  bookableresourceid: string;

  @IsString()
  @IsNotEmpty()
  role: string;
}
