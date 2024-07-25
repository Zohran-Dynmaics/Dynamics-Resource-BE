import { CreateIncidentDto } from "./incident.dto";

function mapCreateIncidentDtoToApiObject(dto: CreateIncidentDto) {
  return {
    "cafm_ProblemIssue@odata.bind": dto.problemIssue,
    "cafm_WorkOrderType@odata.bind": dto.workOrderType,
    cafm_jobtype: dto.jobType,
    cafm_bookedresourceflag: dto.bookedResourceFlag,
    caseorigincode: dto.caseOriginCode,
    "customerid_account@odata.bind": dto.customerAccountId,
    description: dto.description,
    "msdyn_incidenttype@odata.bind": dto.incidentType,
    "primarycontactid@odata.bind": dto.primaryContactId,
    title: dto.title,
    cafm_area: dto.area,
    cafm_appointmentdate: dto.appointmentDate,
    cafm_resourceid: dto.resourceId,
    cafm_service: dto.service,
  };
}
