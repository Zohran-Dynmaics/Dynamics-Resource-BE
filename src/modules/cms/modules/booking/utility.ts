import * as moment from "moment";
import {
    CalenderDataDto,
    TasksCountDto,
    TasksDataDto,
    CalenderDataObjectType,
    TaskDetailDto,
} from "./booking.dto";

export const countBookings = (bookings) => {
    const today = moment(new Date());
    const tomorrow = moment(today).add(1, "day");
    const endOfWeek = moment(today).endOf("week");

    const taskCountDto = new TasksCountDto();
    taskCountDto.total = bookings?.["@odata.count"];

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

    return taskCountDto;
};

export const FormatDataForCalender = (value: any, date?: Date | string): CalenderDataObjectType => {
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
            duration: null,
            location: null,
        };
    });


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

        while (duration > 0) {
            const calenderDtoObject = new CalenderDataDto();
            const connectedToPrevious = count !== 0;

            calenderDtoObject.hour = moment(booking?.starttime).add(count, "hours").format("H");
            calenderDtoObject.bookingId = booking?.msdyn_workorder?.msdyn_name || null; // bookingId is work-order-no.
            calenderDtoObject.title = booking?.msdyn_workorder?.msdyn_serviceaccount?.name || null;
            calenderDtoObject.bookingStatus = booking?.BookingStatus?.name || null;
            calenderDtoObject.reponseType = booking?.msdyn_workorder?.msdyn_workordertype?.msdyn_name || null;
            calenderDtoObject.location = booking?.msdyn_workorder?.msdyn_FunctionalLocation?.msdyn_name || null;
            calenderDtoObject.duration = booking?.duration || null;
            calenderDtoObject.time = moment(booking?.starttime).add(count, 'hours').format("hA");
            calenderDtoObject.bookingStatus = booking?.BookingStatus?.name;
            calenderDtoObject.connectedToPrevious = connectedToPrevious;

            if (!responseData[key]) {
                responseData[key] = [];
            }
            responseData[key].push(calenderDtoObject);

            duration -= 60;
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
        const { plus_case = null, msdyn_workorder } = booking;

        return {
            bookingId: booking?.bookableresourcebookingid,
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

export const FormateDataForTaskDetail = (value: any) => {
    const taskDetailDto = new TaskDetailDto();

    taskDetailDto.bookingId = value?.bookableresourcebookingid || null;
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
