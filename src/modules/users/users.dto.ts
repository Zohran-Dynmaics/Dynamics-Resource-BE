import { IsMongoId, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
    @IsMongoId({ message: "Invalid Object Id." })
    _id: string;

    @IsOptional()
    @IsString()
    password?: string;

    @IsOptional()
    @IsString()
    project?: string;
}

export class SearchUserDto {
    @IsOptional()
    @IsMongoId()
    _id?: string;

    @IsOptional()
    @IsString()
    email?: string;

    @IsOptional()
    @IsString()
    projectId?: string;
}