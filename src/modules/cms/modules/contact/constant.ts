import { COMMON_URL } from "src/shared/constant"
import { ParamsDto } from "../../cms.dto";

const query: ParamsDto = {
    $select: "fullname",
    $expand: "plus_building($select=msdyn_name;$expand=msdyn_FunctionalLocationType($select=msdyn_name)),parentcustomerid_account($select=name;$expand=parentaccountid($select=name))",
    $count: true,
}

export const URL = (baseUrl: string) => `${baseUrl}${COMMON_URL}/contacts`;
export const formatQuery = (query: ParamsDto) => {
    return Object.keys(query).map(key => `${key}=${query[key]}`).join('&');
}


export const CONTACTS_ENDPOINTS = {
    ALL_CONTACTS: {
        endpoint: (baseUrl: string) => URL(baseUrl),
        searchQuery: query,
    },
    CONTACT_DETAIL: {
        endpoint: (baseUrl: string, contactId: string) => `${URL(baseUrl)}(${contactId})`,
        searchQuery: query,
    }
}


