import { IsDateString, IsString } from "class-validator";

export class GetResourceSlotsDto {
    @IsString({ message: "Account Id is required." })
    accountId: string;

    @IsString({ message: "Characteristic is required." })
    characteristic: string;

    @IsString({ message: "Category is required." })
    category: string;

    @IsString({ message: "Inspection Date is required." })
    inspectionDate: string
}