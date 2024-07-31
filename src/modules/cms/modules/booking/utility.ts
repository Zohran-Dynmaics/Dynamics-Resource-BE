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

        if (bookingDate.isSame(today, "day")) {
            taskCountDto.today++;
            taskCountDto.week++;
        } else if (bookingDate.isSame(tomorrow, "day")) {
            taskCountDto.tomorrow++;
            taskCountDto.week++;
        } else if (bookingDate.isBetween(today, endOfWeek, null, "[]")) {
            taskCountDto.week++;
        }
    });
    taskCountDto.total = taskCountDto?.today + taskCountDto?.tomorrow + taskCountDto?.week;

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
            bookingId: null,
            title: null,
            bookingStatus: null,
            reponseType: null,
            time: `${hour}${period}`,
            connectedToPrevious: false,
            startTime: null,
            endTime: null,
            duration: null,
            location: null,
        };
    });

    return allHours;
}

export const FormatDataForCalender = (value: any, date?: Date | string): CalenderDataObjectType => {
    const allHours = DummyCalenderDataForHours();


    const calenderDataObjectType = new CalenderDataObjectType();
    const responseData = [];
    const key = moment(date).format('YYYY-MM-DD');

    if (value.length === 0) {
        calenderDataObjectType[key] = allHours;
        return calenderDataObjectType;
    }

    value.forEach((booking) => {
        let count = 0;
        let duration = booking?.duration;
        const startTime = moment(booking?.starttime, "HH:mm");

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

            calenderDtoObject.hour = moment(booking?.starttime).add(count, "hours").format("H");
            calenderDtoObject.bookingId = booking?.msdyn_workorder?.msdyn_name || null;
            calenderDtoObject.title = booking?.msdyn_workorder?.msdyn_serviceaccount?.name || null;
            calenderDtoObject.bookingStatus = booking?.BookingStatus?.name || null;
            calenderDtoObject.startTime = moment(booking?.starttime).format("h:mmA");
            calenderDtoObject.endTime = moment(booking?.endtime).format("h:mmA");
            calenderDtoObject.reponseType = booking?.msdyn_workorder?.msdyn_workordertype?.msdyn_name || null;
            calenderDtoObject.location = booking?.msdyn_workorder?.msdyn_FunctionalLocation?.msdyn_name || null;
            calenderDtoObject.duration = durationPerHour || null;
            calenderDtoObject.time = moment(booking?.starttime).add(count, 'hours').format("hA");
            calenderDtoObject.connectedToPrevious = connectedToPrevious;

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
    return calenderDataObjectType;
};

export const FormatDataForTasks = (value: any) => {
    if (!value.length) return [];

    return value.map((booking) => {
        const { plus_case, msdyn_workorder } = booking;

        return {
            ticketId: booking?.bookableresourcebookingid,
            ticketNumber: plus_case?.ticketnumber || null,
            title: plus_case?.title || null,
            priority: plus_case?.prioritycode || null,
            location: plus_case?.msdyn_FunctionalLocation?.msdyn_name,
            building: msdyn_workorder?.cafm_Building?.cafm_name,
            startTime: booking?.starttime,
            endTime: booking?.endtime,
            estimatedTravelTime: booking?.msdyn_estimatedtravelduration,
            duration: booking?.duration,
            responseType: msdyn_workorder?.msdyn_workordertype?.msdyn_name,
        };
    });
};

export const FormatDataForTaskDetail = (value: any) => {
    const taskDetailDto = new TaskDetailDto();

    taskDetailDto.ticketId = value?.bookableresourcebookingid || null;
    taskDetailDto.ticketNumber = value?.plus_case?.ticketnumber || null;
    taskDetailDto.title = value?.plus_case?.title || null;
    taskDetailDto.priority = value?.plus_case?.prioritycode || null;
    taskDetailDto.startTime = value?.starttime || null;
    taskDetailDto.endTime = value?.endtime || null;
    taskDetailDto.estimatedTravelTime = value?.msdyn_estimatedtravelduration || null;
    taskDetailDto.duration = value?.duration || null;
    taskDetailDto.location = value?.plus_case?.msdyn_FunctionalLocation?.msdyn_name;
    taskDetailDto.workOrder = value?.msdyn_workorder?.msdyn_name || null;
    taskDetailDto.customerName = value?.plus_case?.primarycontactid?.fullname || null;
    taskDetailDto.issue = "AC not working [HARD CODED VALUE]";
    taskDetailDto.description = "AC is not working since last week [HARD CODED VALUE]"

    return taskDetailDto;
};


export const TaskOfDayFilter = (resource_id: string, filter?: string, workordertype?: string) => {


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

    return queryString;
}