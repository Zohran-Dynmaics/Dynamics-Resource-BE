import * as moment from "moment";
import { CalenderDataDto, TasksCountDto, TasksDataDto, CalenderDataObjectType } from "./booking.dto";

export const countBookings = (bookings) => {
    const today = moment(new Date());
    const tomorrow = moment(today).add(1, 'day');
    const endOfWeek = moment(today).endOf('week');

    const taskCountDto = new TasksCountDto();
    taskCountDto.total = bookings?.['@odata.count']


    for (const booking of bookings?.value) {
        const bookingDate = moment(new Date(booking.starttime));

        if (bookingDate.isSame(today, 'day')) {
            taskCountDto.today++;
            taskCountDto.week++;
        } else if (bookingDate.isSame(tomorrow, 'day')) {
            taskCountDto.tomorrow++;
            taskCountDto.week++;
        } else if (bookingDate.isBetween(today, endOfWeek, null, '[]')) {
            taskCountDto.week++;
        }
    }

    return taskCountDto;
}

export const FormatDataForCalender = (value: any, date?: Date | string): CalenderDataObjectType => {

    const allHours = Array.from({ length: 24 }, (_, index) => {

        let period = index < 12 ? 'AM' : 'PM';
        let hour = index % 12;
        hour = hour === 0 ? 12 : hour;

        return ({
            hour: index.toString(),
            bookingId: null,
            title: null,
            bookingStatus: null,
            reponseType: null,
            time: `${hour}${period}`,
            connectedToPrevious: false,
            duration: null,
            location: null,
        })
    });


    const calenderDataObjectType = new CalenderDataObjectType();

    const responseData = {}
    let key = moment(date).format('YYYY-MM-DD');
    if (value.length == 0) {
        calenderDataObjectType[key] = allHours;
        return calenderDataObjectType;
    }


    value.forEach((booking: any) => {

        const calenderDtoObject = new CalenderDataDto();

        let count = 0;

        let duration = booking?.duration;
        while (duration > 0) {
            calenderDtoObject.hour = moment(booking?.starttime).add(count, 'hours').format('H');
            calenderDtoObject.bookingId = booking?.bookableresourcebookingid || null;
            calenderDtoObject.title = booking?.msdyn_workorder?.msdyn_serviceaccount?.name || null;
            calenderDtoObject.bookingStatus = booking?.BookingStatus?.name || null;
            calenderDtoObject.reponseType = booking?.msdyn_workorder?.msdyn_workordertype?.msdyn_name || null;
            calenderDtoObject.location = booking?.msdyn_workorder?.msdyn_FunctionalLocation?.msdyn_name || null;
            calenderDtoObject.duration = booking?.duration || null;
            calenderDtoObject.time = moment(booking?.starttime).format('HA');
            calenderDtoObject.connectedToPrevious = count == 0 ? false : true;
            if (!responseData[key]) {
                responseData[key] = [];
            }
            responseData[key].push(calenderDtoObject);
            duration = Math.floor(duration / 60);
            count++;
        }

    });



    if (value.length !== 0) {
        responseData[key].forEach(booking => {
            const hourIndex = parseInt(booking.hour, 10);
            allHours[hourIndex] = { ...booking };
        });
    }

    calenderDataObjectType[key] = allHours;
    return calenderDataObjectType;
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