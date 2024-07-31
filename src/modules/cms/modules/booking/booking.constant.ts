import { COMMON_URL } from "src/shared/constant"
import { ParamsDto } from "../../cms.dto";
import { mergeParams } from "src/shared/utility/utility";
import { Param } from '@nestjs/common';

const initialQuery: ParamsDto = {
    $select: "starttime,duration,endtime,msdyn_estimatedtravelduration",
    $expand: "msdyn_workorder($select=msdyn_name;$expand=msdyn_workordertype($select=msdyn_name),msdyn_FunctionalLocation($select=msdyn_name),msdyn_serviceaccount($select=name)),BookingStatus($select=name),plus_case($select=ticketnumber,title,prioritycode;$expand=primarycontactid($select=fullname),msdyn_FunctionalLocation($select=msdyn_name),plus_problemissues($select=plus_name))",
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


