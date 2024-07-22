import { getDayBoundaries } from "./utility/utility";

export const HASH_SALT = 10;
export const CRM_VERSION = "v9.1";
const COMMON_URL = `api/data/${CRM_VERSION}`;

export const URLS_AND_QUERY_PARAMS = {
    BOOKING: {
        GET: {
            TASKS_OF_DAY: {
                endpoint: (base_url: string): string =>
                    `${base_url}${COMMON_URL}/bookableresourcebookings?`,

                query: (date: Date | string | null, resourceId: string) => {
                    const params = {
                        '$select': 'starttime,endtime',
                        '$expand': 'cafm_Case($select=ticketnumber,title;$expand=msdyn_FunctionalLocation($select=msdyn_name),cafm_Building($select=cafm_name),customerid_account($select=name)),msdyn_workorder($select=msdyn_name),BookingStatus($select=name)',
                        '$filter': `_resource_value eq ${resourceId}`,
                        '$count': 'true'
                    };
                    if (date) {
                        const { startOfDay, endOfDay } = getDayBoundaries(
                            new Date(date).toISOString(),
                        );
                        params['$filter'] = `starttime ge ${startOfDay} and starttime lt ${endOfDay} and _resource_value eq ${resourceId}`
                    }
                    return Object.entries(params)
                        .map(([key, value]) => `${key}=${value}`)
                        .join('&');
                }
            }
        }
    }

};
