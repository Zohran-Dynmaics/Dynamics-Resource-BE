import * as moment from "moment";
import { getDayBoundaries } from "./utility/utility";

export const HASH_SALT = 10;
export const CRM_VERSION = "v9.1";
const COMMON_URL = `api/data/${CRM_VERSION}`;

const DATES = {
    today: (date: Date) => getDayBoundaries(
        new Date(date).toISOString(),
    ),
    tomorrow: (date: Date) => {
        const tomorrow = new Date();
        tomorrow.setDate(date.getDate() + 7);
        return getDayBoundaries(
            tomorrow
        )
    },
    week: (date: Date) => {
        const { startOfDay } = getDayBoundaries(new Date(date).toISOString())
        const nextWeekDate = new Date();
        nextWeekDate.setDate(date.getDate() + 7);
        const { endOfDay } = getDayBoundaries(nextWeekDate);

        return { startOfDay, endOfDay };
    }

}

export const URLS_AND_QUERY_PARAMS = {
    BOOKING: {
        GET: {
            TASKS: {
                endpoint: (base_url: string): string =>
                    `${base_url}${COMMON_URL}/bookableresourcebookings?`,

                query: (query: any | null, resourceId: string) => {
                    const { filter = null, workordertype = null } = query;
                    const params = {
                        // '$select': 'starttime,endtime,duration',
                        '$expand': 'msdyn_workorder($expand=msdyn_workordertype($select=msdyn_name),msdyn_FunctionalLocation($select=msdyn_name),msdyn_serviceaccount($select=name)),BookingStatus($select=name)',
                        '$filter': `_resource_value eq ${resourceId}`,
                        '$count': 'true'
                    };
                    if (filter) {
                        const date = new Date();
                        const { startOfDay, endOfDay } = DATES[filter](date);
                        params['$filter'] += ` and starttime ge ${startOfDay} and starttime lt ${endOfDay}`
                    }
                    if (workordertype) {
                        params['$filter'] += ` and msdyn_workorder/_msdyn_workordertype_value eq ${workordertype}`
                    }
                    return Object.entries(params)
                        .map(([key, value]) => `${key}=${value}`)
                        .join('&');
                }
            },
            TASKS_FOR_CALENDER: {
                endpoint: (base_url: string): string =>
                    `${base_url}${COMMON_URL}/bookableresourcebookings?`,

                query: (date: Date | string | null, resourceId: string) => {
                    const params = {
                        // '$select': 'starttime,endtime,duration',
                        '$expand': 'msdyn_workorder($expand=msdyn_workordertype($select=msdyn_name),msdyn_FunctionalLocation($select=msdyn_name),msdyn_serviceaccount($select=name)),BookingStatus($select=name)',
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
            },

        }
    }

};
