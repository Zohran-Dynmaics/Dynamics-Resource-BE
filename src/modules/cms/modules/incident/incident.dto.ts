import { IsBoolean, IsDateString, IsInt, IsString } from "class-validator";

export class CreateIncidentDto {
  @IsString({ message: "Problem Issue is required." })
  problemIssue: string;

  @IsString({ message: "Work Order Type is required." })
  workOrderType: string;

  @IsBoolean({ message: "Job Type is required." })
  jobType: boolean;

  @IsBoolean({ message: "Booked Resource Flag is required." })
  bookedResourceFlag: boolean;

  @IsInt({ message: "Case Origin Code is required." })
  caseOriginCode: number;

  @IsString({ message: "Customer Account ID is required." })
  customerAccountId: string;

  @IsString({ message: "Description is required." })
  description: string;

  @IsString({ message: "Incident Type is required." })
  incidentType: string;

  @IsString({ message: "Primary Contact ID is required." })
  primaryContactId: string;

  @IsString({ message: "Title is required." })
  title: string;

  @IsInt({ message: "Area is required." })
  area: number;

  @IsDateString({}, { message: "Appointment Date is required." })
  appointmentDate: string;

  @IsString({ message: "Resource ID is required." })
  resourceId: string;

  @IsInt({ message: "Service is required." })
  service: number;
}
