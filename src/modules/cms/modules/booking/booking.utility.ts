import * as moment from "moment";
import {
    CalenderDataDto,
    TasksCountDto,
    TasksDataDto,
    CalenderDataObjectType,
    TaskDetailDto,
} from "./booking.dto";
import { DATES } from "src/shared/constant";

export const countBookings = (bookings) => {
    const today = moment(new Date());
    const tomorrow = moment(today).add(1, "day");
    const endOfWeek = moment(today).endOf("week");

    const taskCountDto = new TasksCountDto();


    bookings?.value.forEach((booking) => {
        const bookingDate = moment(new Date(booking.starttime));

        if (booking?.msdyn_workorder?._msdyn_workordertype_value !== "5d3189f6-474e-ef11-a316-6045bd14a33f") {
            taskCountDto.total++;
            if (bookingDate.isSame(today, "day")) {
                taskCountDto.today++;
                taskCountDto.week++;
            } else if (bookingDate.isSame(tomorrow, "day")) {
                taskCountDto.tomorrow++;
                taskCountDto.week++;
            } else if (bookingDate.isBetween(today, endOfWeek, null, "[]")) {
                taskCountDto.week++;
            }
        }

    });

    return taskCountDto;
};


function getRemainingMinutesInCurrentHour(time) {
    return 60 - time.minutes();
}

function DummyCalenderDataForHours(): any {
    const allHours = Array.from({ length: 24 }, (_, index) => {
        const period = index < 12 ? 'AM' : 'PM';
        const hour = index % 12 || 12;

        return {
            hour: index.toString(),
            workOrderId: null,
            caseId: null,
            title: null,
            bookingStatus: null,
            workOrderType: null,
            time: `${hour}${period}`,
            connectedToPrevious: false,
            travelTime: null,
            startDate: null,
            startTime: null,
            endDate: null,
            endTime: null,
            duration: null,
            location: null,
            priority: null,
        };
    });

    return allHours;
}

export const FormatDataForCalender = (apiResponse: any, date?: Date | string): any => {
    const allHours = DummyCalenderDataForHours();
    const value: any = apiResponse?.value;

    const calenderDataObjectType = new CalenderDataObjectType();
    const responseData = [];

    const key = moment(date).format('YYYY-MM-DD');

    if (value.length === 0) {
        calenderDataObjectType[key] = allHours;
        return { totalTasks: 0, ...calenderDataObjectType };
    }

    value.forEach((booking) => {
        let count = 0;
        let duration = booking?.duration;
        const startTime = moment(booking.starttime).utc();
        let remainingMinutesInCurrentHour = getRemainingMinutesInCurrentHour(startTime);
        let currentHour = startTime.hour();
        while (duration > 0) {


            let durationPerHour;
            if (remainingMinutesInCurrentHour >= duration) {
                durationPerHour = duration;
                duration = 0;
            } else {
                durationPerHour = remainingMinutesInCurrentHour;
                duration -= remainingMinutesInCurrentHour;
                currentHour++;
                remainingMinutesInCurrentHour = 60;
            }

            const calenderDtoObject = new CalenderDataDto();
            const connectedToPrevious = count !== 0;

            calenderDtoObject.hour = moment(booking?.starttime).utc().add(count, "hours").format("H");
            calenderDtoObject.workOrderId = booking?.msdyn_workorder?.msdyn_name || null;
            calenderDtoObject.caseId = booking?.plus_case?.ticketnumber || null; // caseId = plusCase-> ticketnumber
            calenderDtoObject.title = booking?.msdyn_workorder?.msdyn_serviceaccount?.name || null;
            calenderDtoObject.bookingStatus = booking?.BookingStatus?.name || null;
            calenderDtoObject.startTime = moment(booking?.starttime).utc().format("h:mmA");
            calenderDtoObject.startDate = booking?.starttime;
            calenderDtoObject.endTime = moment(booking?.endtime).utc().format("h:mmA");
            calenderDtoObject.endDate = booking?.endtime;
            calenderDtoObject.workOrderType = booking?.msdyn_workorder?.msdyn_workordertype?.msdyn_name || null;
            calenderDtoObject.location = booking?.msdyn_workorder?.msdyn_FunctionalLocation?.msdyn_name || null;
            calenderDtoObject.duration = durationPerHour || null;
            calenderDtoObject.time = moment(booking?.starttime).utc().add(count, "hours").format("hA");
            calenderDtoObject.connectedToPrevious = connectedToPrevious;
            calenderDtoObject.travelTime = !connectedToPrevious ? booking?.msdyn_estimatedtravelduration : 0;
            calenderDtoObject.priority = booking?.msdyn_workorder?.msdyn_priority?.msdyn_name || 'No priority'

            if (!responseData[key]) {
                responseData[key] = [];
            }
            responseData[key].push(calenderDtoObject);

            count++;
        }
    });
    responseData[key]?.forEach((booking) => {
        const hourIndex = parseInt(booking.hour, 10);
        allHours[hourIndex] = { ...booking };
    });

    calenderDataObjectType[key] = allHours;

    return { totalTasks: apiResponse?.['@odata.count'], ...calenderDataObjectType };
};

export const FormatDataForTasks = (value: any) => {
    if (!value.length) return [];

    const returnData = [];

    value.forEach((booking) => {
        const { plus_case, msdyn_workorder } = booking;

        if (msdyn_workorder?._msdyn_workordertype_value !== "5d3189f6-474e-ef11-a316-6045bd14a33f") {
            returnData.push({
                ticketId: booking?.bookableresourcebookingid,
                ticketNumber: plus_case?.ticketnumber || msdyn_workorder?.msdyn_name,
                title: plus_case?.title || msdyn_workorder?.msdyn_workordersummary,
                priority: msdyn_workorder?.msdyn_priority?.msdyn_name || null,
                location: plus_case?.msdyn_FunctionalLocation?.msdyn_name || msdyn_workorder?.msdyn_FunctionalLocation?.msdyn_name,
                building: msdyn_workorder?.cafm_Building?.cafm_name,
                startTime: booking?.starttime,
                endTime: booking?.endtime,
                estimatedTravelTime: booking?.msdyn_estimatedtravelduration,
                duration: booking?.duration,
                workOrderType: msdyn_workorder?.msdyn_workordertype?.msdyn_name || null,
                workOrderTypeId: msdyn_workorder?.msdyn_workordertype?.msdyn_workordertypeid || null,
            })
        }

    });
    return returnData;
};

export const FormatDataForTaskDetail = (value: any) => {
    const taskDetailDto = new TaskDetailDto();

    taskDetailDto.ticketId = value?.bookableresourcebookingid || null;
    taskDetailDto.ticketNumber = value?.plus_case?.ticketnumber || value?.msdyn_workorder?.msdyn_name;
    taskDetailDto.title = value?.plus_case?.title || value?.msdyn_workorder?.msdyn_workordersummary;
    taskDetailDto.priority = value?.msdyn_workorder?.msdyn_priority?.msdyn_name || null;
    taskDetailDto.startTime = value?.starttime || null;
    taskDetailDto.endTime = value?.endtime || null;
    taskDetailDto.estimatedTravelTime = value?.msdyn_estimatedtravelduration || null;
    taskDetailDto.duration = value?.duration || null;
    taskDetailDto.location = value?.plus_case?.msdyn_FunctionalLocation?.msdyn_name || value?.msdyn_workorder?.msdyn_FunctionalLocation?.msdyn_name;
    taskDetailDto.workOrder = value?.msdyn_workorder?.msdyn_name || null;
    taskDetailDto.customerName = value?.plus_case?.primarycontactid?.fullname || value?.msdyn_workorder?.msdyn_reportedbycontact?.fullname;
    taskDetailDto.issue = value?.plus_case?.plus_problemissues?.plus_name;
    taskDetailDto.description = value?.BookingStatus?.description ?? "BookingStatus description not available";
    taskDetailDto.createdOn = value?.msdyn_workorder?.createdon;
    taskDetailDto.createByName = value?.msdyn_workorder?.createdby?.fullname || null;
    taskDetailDto.createByDesignation = value?.msdyn_workorder?.createdby?.title || null;

    return taskDetailDto;
};


export const TaskOfDayFilter = (resource_id: string, filter?: string, workordertype?: string, query?: any) => {
    query = typeof query === "string" ? query?.split(';')?.map(pair => pair?.split('='))?.map(pair => { return { [pair[0]]: pair[1] } })[0] : query;

    let queryString: string = `_resource_value eq ${resource_id}`;

    if (workordertype) {
        queryString +=
            ` and msdyn_workorder/_msdyn_workordertype_value eq ${workordertype}`;
    }
    if (filter) {
        const { startOfDay, endOfDay } = DATES[filter]();
        queryString +=
            ` and starttime ge ${startOfDay} and starttime lt ${endOfDay}`;
    }
    if (query?.$filter) {
        queryString +=
            ` and ${query?.$filter}`;
    }

    return queryString;
}