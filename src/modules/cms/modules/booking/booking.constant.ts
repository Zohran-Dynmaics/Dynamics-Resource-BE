import { COMMON_URL } from "src/shared/constant"
import { ParamsDto } from "../../cms.dto";
import { mergeParams } from "src/shared/utility/utility";
import { Param } from '@nestjs/common';

const initialQuery: ParamsDto = {
    $expand: "msdyn_workorder($expand=msdyn_workordertype($select=msdyn_name),msdyn_FunctionalLocation($select=msdyn_name),msdyn_serviceaccount),BookingStatus($select=name),plus_case($expand=primarycontactid($select=fullname),msdyn_FunctionalLocation($select=msdyn_name))",
    $count: true,
}

export const URL = (baseUrl: string) => `${baseUrl}${COMMON_URL}/bookableresourcebookings`;




export const BOOKING_ENDPOINTS = {
    ALL_BOOKINGS: {
        endpoint: (baseUrl: string) => URL(baseUrl),
        searchQuery: (query: ParamsDto) => mergeParams(initialQuery, query),
    },
    BOOKING: {
        endpoint: (baseUrl: string, bookingId: string) => `${URL(baseUrl)}(${bookingId})`,
        searchQuery: (query: ParamsDto) => mergeParams(initialQuery, query),
    },
}


