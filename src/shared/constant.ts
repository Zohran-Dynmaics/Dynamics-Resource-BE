import * as moment from "moment";
import { getDayBoundaries } from "./utility/utility";

export const HASH_SALT = 10;
export const CRM_VERSION = "v9.1";
const COMMON_URL = `api/data/${CRM_VERSION}`;
const END_POINTS = {
    BOOKABALE_RESOURCE_BOOKINGS: `${COMMON_URL}/bookableresourcebookings?`,
}

const DATES = {
    today: (date: Date) => getDayBoundaries(new Date(date).toISOString()),
    tomorrow: (date: Date) => {
        const tomorrow = new Date(date);
        tomorrow.setDate(date.getDate() + 7);
        return getDayBoundaries(tomorrow);
    },
    week: (date: Date) => {
        const { startOfDay } = getDayBoundaries(new Date(date).toISOString());
        const nextWeekDate = new Date(date);
        nextWeekDate.setDate(date.getDate() + 7);
        const { endOfDay } = getDayBoundaries(nextWeekDate);

        return { startOfDay, endOfDay };
    }
};

const buildQueryParams = (query: any | null, resourceId: string, date?: Date | string | null) => {
    const params = {
        '$expand': 'msdyn_workorder($expand=msdyn_workordertype($select=msdyn_name),msdyn_FunctionalLocation($select=msdyn_name),msdyn_serviceaccount($select=name)),BookingStatus($select=name)',
        '$filter': `_resource_value eq ${resourceId}`,
        '$count': 'true'
    };

    if (query?.filter) {
        const { startOfDay, endOfDay } = DATES[query?.filter](date ? new Date(date) : new Date());
        params['$filter'] += ` and starttime ge ${startOfDay} and starttime lt ${endOfDay}`;
    }

    if (query?.workordertype) {
        params['$filter'] += ` and msdyn_workorder/_msdyn_workordertype_value eq ${query?.workordertype}`;
    }

    if (date) {
        const { startOfDay, endOfDay } = getDayBoundaries(
            new Date(date).toISOString(),
        );
        params['$filter'] += ` and starttime ge ${startOfDay} and starttime lt ${endOfDay}`
    }

    return Object.entries(params)
        .map(([key, value]) => `${key}=${value}`)
        .join('&');
};

export const URLS_AND_QUERY_PARAMS = {
    BOOKING: {
        GET: {
            BOOKINGS: {
                endpoint: (base_url: string): string => `${base_url}${END_POINTS.BOOKABALE_RESOURCE_BOOKINGS}`,
                query: (query: any | null, resourceId: string) => buildQueryParams(query, resourceId)
            },
            BOOKINGS_FOR_CALENDER: {
                endpoint: (base_url: string): string => `${base_url}${END_POINTS.BOOKABALE_RESOURCE_BOOKINGS}`,
                query: (date: Date | string | null, resourceId: string) => buildQueryParams(null, resourceId, date)
            },
        }
    }
};