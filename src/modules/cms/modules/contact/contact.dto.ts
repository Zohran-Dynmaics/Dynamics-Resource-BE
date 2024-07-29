import { IsNotEmpty, IsString } from "class-validator";

export class ContactsListDto {
    @IsString()
    @IsNotEmpty()
    contactId: string;

    @IsString()
    @IsNotEmpty()
    fullName: string;

    @IsString()
    @IsNotEmpty()
    contactNumber: string;

    @IsString()
    @IsNotEmpty()
    location: string;

    @IsString()
    @IsNotEmpty()
    building: string;

    @IsString()
    @IsNotEmpty()
    parentCompany: string;
}