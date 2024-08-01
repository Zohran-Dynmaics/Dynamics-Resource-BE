import {
    IsString,
    IsOptional,
    isString,
    IsNotEmpty,
    IsEnum,
    IsBoolean,
    IsNumber,
} from "class-validator";

export class BaseDateDto {
    @IsString()
    date: Date | string;
}

export class OptionalDateDto extends BaseDateDto {
    @IsOptional()
    date: Date | string;
}

export class RequiredDateDto extends BaseDateDto {
    @IsNotEmpty()
    date: Date | string;
}

export enum FilterType {
    today = "today",
    tomorrow = "tomorrow",
    week = "week",
}

export class TaskFilterDto {
    @IsEnum(FilterType)
    @IsOptional()
    filter: FilterType;

    @IsString()
    @IsOptional()
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

    @IsNumber()
    @IsNotEmpty()
    duration: number;

    @IsString()
    @IsOptional()
    reponseType: null;

    @IsString()
    @IsNotEmpty()
    location: string;

    @IsString()
    @IsNotEmpty()
    time: string;

    @IsString()
    @IsNotEmpty()
    startTime: string;

    @IsString()
    @IsNotEmpty()
    endTime: string;


    @IsBoolean()
    @IsOptional()
    connectedToPrevious?: boolean;
}

export class TasksDataDto {
    @IsString()
    @IsNotEmpty()
    task_id: string;

    @IsString()
    @IsNotEmpty()
    ticket_no: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    priority: string;

    @IsString()
    @IsNotEmpty()
    location: string;

    @IsString()
    @IsNotEmpty()
    responseType: string;

    @IsString()
    @IsNotEmpty()
    building: string;

    @IsString()
    @IsNotEmpty()
    start_time: string;

    @IsString()
    @IsNotEmpty()
    end_time: string;

    @IsString()
    @IsNotEmpty()
    estimated_travel_time: string;

    @IsString()
    @IsNotEmpty()
    total_time: string;
}

export class TasksCountDto {
    @IsNumber()
    @IsNotEmpty()
    total: number = 0;

    @IsNumber()
    @IsNotEmpty()
    today: number = 0;

    @IsNumber()
    @IsNotEmpty()
    tomorrow: number = 0;

    @IsNumber()
    @IsNotEmpty()
    week: number = 0;
}

export class TaskDetailDto {

    @IsString()
    @IsNotEmpty()
    ticketId: string;

    @IsString()
    @IsNotEmpty()
    ticketNumber: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    priority: string;

    @IsString()
    @IsNotEmpty()
    startTime: string;

    @IsString()
    @IsNotEmpty()
    endTime: string;

    @IsString()
    @IsNotEmpty()
    estimatedTravelTime: string;

    @IsString()
    @IsNotEmpty()
    duration: string;

    @IsString()
    @IsNotEmpty()
    workOrder: string;


    @IsString()
    @IsNotEmpty()
    customerName: string;

    @IsString()
    @IsNotEmpty()
    location: string;

    @IsString()
    @IsNotEmpty()
    issue: string;


    @IsString()
    @IsNotEmpty()
    description: string;
}

export class CalenderDataObjectType {
    [key: string]: Array<CalenderDataDto>;

}

export class TaskUpdateDto {
    @IsString()
    @IsOptional()
    'BookingStatus@odata.bind': string;
}
