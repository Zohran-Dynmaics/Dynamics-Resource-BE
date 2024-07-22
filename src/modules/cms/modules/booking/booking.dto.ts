import { IsString,IsOptional } from "class-validator";

export class DateDto {
    @IsString()
    @IsOptional()
    date: Date | string;
}