import { COMMON_URL } from "src/shared/constant"
import { ParamsDto } from "../../cms.dto";

const query: ParamsDto = {
    $count: true,
}

export const URL = (baseUrl: string) => `${baseUrl}${COMMON_URL}/contacts`;


export const CONTACTS_ENDPOINTS = {
    ALL_INCIDENTS: {
        endpoint: (baseUrl: string) => URL(baseUrl),
        searchQuery: query,
    },
    INCIDENT: {
        endpoint: (baseUrl: string, contactId: string) => `${URL(baseUrl)}(${contactId})`,
        searchQuery: query,
    },
    CREATE_INCIDENT: {
        endpoint: (baseUrl: string) => URL(baseUrl),
    }
}


