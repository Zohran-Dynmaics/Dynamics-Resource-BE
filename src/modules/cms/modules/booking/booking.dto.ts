import { Transform } from "class-transformer";
import { IsDate, IsDateString, IsString } from "class-validator";
import moment from "moment";

export class DateDto {
    @IsString()
    date: Date | string;
}