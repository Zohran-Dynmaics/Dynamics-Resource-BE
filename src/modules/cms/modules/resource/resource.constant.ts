import { COMMON_URL } from "src/shared/constant"
import { ParamsDto } from "../../cms.dto";

const query: ParamsDto = {
    $select: "name,plus_password,plus_username",
    $expand: "UserId($select=fullname,caltype,isintegrationuser,islicensed;$expand=defaultmailbox($select=emailaddress))",
    $count: true,
}

export const URL = (baseUrl: string) => `${baseUrl}${COMMON_URL}/bookableresources`;
export const formatQuery = (query: ParamsDto) => {
    return Object.keys(query).map(key => `${key}=${query[key]}`).join('&');
}


export const RESOURCE_ENDPOINTS = {
    ALL_RESOURCES: {
        endpoint: (baseUrl: string) => URL(baseUrl),
        searchQuery: query,
    },
    RESOURCE: {
        endpoint: (baseUrl: string, contactId: string) => `${URL(baseUrl)}(${contactId})`,
        searchQuery: query,
    },
}


