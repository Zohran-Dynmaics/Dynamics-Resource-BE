import * as moment from "moment";
import { CalenderDataDto, TasksDataDto } from "./booking.dto";

export const countBookings = (bookings) => {
    // '2024-05-16T00:00:00Z'
    const today = moment(new Date());
    const tomorrow = moment(today).add(1, 'day');
    const endOfWeek = moment(today).endOf('week');

    let todayCount = 0;
    let tomorrowCount = 0;
    let weekCount = 0;

    for (const booking of bookings) {
        const bookingDate = moment(new Date(booking.starttime));

        if (bookingDate.isSame(today, 'day')) {
            todayCount++;
        } else if (bookingDate.isSame(tomorrow, 'day')) {
            tomorrowCount++;
        } else if (bookingDate.isBetween(today, endOfWeek, null, '[]')) {
            weekCount++;
        }
    }

    return { today: todayCount, tomorrow: tomorrowCount, week: weekCount + todayCount + tomorrowCount };
}

export const FormatDataForCalender = (value: any) => {
    if (value.length == 0) return [];
    const responseData = {}
    let key;

    value.forEach((booking: any) => {
        const calenderDtoObject = new CalenderDataDto();
        calenderDtoObject.hour = moment(booking?.starttime).format('H');
        calenderDtoObject.bookingId = booking?.bookableresourcebookingid;
        calenderDtoObject.title = booking?.msdyn_workorder?.msdyn_serviceaccount?.name;
        calenderDtoObject.bookingStatus = booking?.BookingStatus?.name;
        calenderDtoObject.reponseType = booking?.msdyn_workorder?.msdyn_workordertype?.msdyn_name;
        calenderDtoObject.time = moment(booking?.starttime).format('HH:mm A');
        calenderDtoObject.connectedToPrevious = false;
        key = moment(booking?.starttime).format('YYYY-MM-DD');
        if (!responseData[key]) {
            responseData[key] = [];
        }
        responseData[key].push(calenderDtoObject);
    });

    const allHours = Array.from({ length: 24 }, (_, index) => ({
        hour: index.toString(),
        bookingId: null,
        title: null,
        bookingStatus: null,
        reponseType: null,
        time: null,
        connectedToPrevious: false,
    })); -0 -

        responseData[key].forEach(booking => {
            const hourIndex = parseInt(booking.hour, 10);
            allHours[hourIndex] = { ...booking };
        });

    return allHours;
}

export const FormateDataForTasks = (value: any) => {
    const responseData: Array<TasksDataDto> = []

    value.forEach((booking: any) => {
        const { cafm_Case = null, msdyn_workorder } = booking;
        responseData.push({
            ticket_no: cafm_Case?.ticketnumber || null,
            title: cafm_Case?.title || null,
            priority: cafm_Case?.priority || null,
            location: msdyn_workorder?.msdyn_FunctionalLocation?.msdyn_name,
            building: msdyn_workorder?.cafm_Building?.cafm_name,
            start_time: booking?.starttime,
            end_time: booking?.endtime,
            estimated_travel_time: booking?.msdyn_estimatedtravelduration,
            total_time: booking?.duration,
            responseType: msdyn_workorder?.msdyn_workordertype?.msdyn_name,
        })
    });

    return responseData;
}