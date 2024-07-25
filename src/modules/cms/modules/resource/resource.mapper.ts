import { GetResourceSlotsDto } from "./resource.dto";

export const mapGetResourceSlotsDtoToApiObject = (dto: GetResourceSlotsDto) => {
  return {
    accountid: dto.accountId,
    characteristic: dto.characteristic,
    category: dto.category,
    inspectiondate: dto.inspectionDate,
  };
};
