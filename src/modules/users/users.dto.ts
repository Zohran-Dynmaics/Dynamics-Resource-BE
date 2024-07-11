import { IsBoolean, IsMongoId, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";

export class UpdateUserDto {
    @IsMongoId({ message: "Invalid Object Id." })
    _id: Types.ObjectId;

    @IsOptional()
    @IsString()
    password?: string;

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
    _id?: Types.ObjectId | string;

    @IsOptional()
    @IsString()
    email?: string;

    @IsOptional()
    @IsString()
    projectId?: string;
}