import { IsString, IsOptional, isString, IsNotEmpty, IsEnum, IsBoolean } from "class-validator";

export class DateDto {
    @IsString()
    @IsOptional()
    date: Date | string;
}

export enum FilterType {
    today = "today",
    tomorrow = "tomorrow",
    week = "week"
}

export class TaskFilterDto {
    @IsEnum(FilterType)
    @IsOptional()
    filter: FilterType;

    @IsString()
    @IsNotEmpty()
    workordertype?: string;
}

export class CalenderDataDto {
    @IsString()
    @IsNotEmpty()
    hour: string;

    @IsString()
    @IsNotEmpty()
    bookingId: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    bookingStatus: string;

    @IsString()
    @IsOptional()
    reponseType: null;

    @IsString()
    @IsNotEmpty()
    time: string;

    @IsBoolean()
    @IsOptional()
    connectedToPrevious?: boolean = false;
}