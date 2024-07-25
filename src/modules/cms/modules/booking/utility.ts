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

export const FormatDataForCalender = (value: any): CalenderDataObjectType => {
    //("🚀 ~ FormatDataForCalender ~ value:", value)
    const calenderDataObjectType = new CalenderDataObjectType();
    if (value.length == 0) return calenderDataObjectType;
    const responseData = {}
    let key;



    value.forEach((booking: any) => {
        //("🚀 ~ value.forEach ~ booking:", booking?.starttime)

        const calenderDtoObject = new CalenderDataDto();
        key = moment(booking?.starttime).format('YYYY-MM-DD');
        let count = 0;

        let duration = booking?.duration;
        while (duration > 0) {
            //("🚀 ~ value.forEach ~ count:", count, "--", duration)
            // //(moment(booking?.starttime).format('H'), "--", moment(booking?.starttime).add(count, 'hours').format('H'))
            calenderDtoObject.hour = moment(booking?.starttime).add(count, 'hours').format('H');
            calenderDtoObject.bookingId = booking?.bookableresourcebookingid;
            calenderDtoObject.title = booking?.msdyn_workorder?.msdyn_serviceaccount?.name;
            calenderDtoObject.bookingStatus = booking?.BookingStatus?.name;
            calenderDtoObject.reponseType = booking?.msdyn_workorder?.msdyn_workordertype?.msdyn_name;
            calenderDtoObject.time = moment(booking?.starttime).format('HA');
            calenderDtoObject.connectedToPrevious = count ? false : true;
            if (!responseData[key]) {
                responseData[key] = [];
            }
            responseData[key].push(calenderDtoObject);
            duration = Math.floor(duration / 60);
            count++;
        }

    });

    const allHours = Array.from({ length: 24 }, (_, index) => ({
        hour: index.toString(),
        bookingId: null,
        title: null,
        bookingStatus: null,
        reponseType: null,
        time: null,
        connectedToPrevious: false,
    }));

    responseData[key].forEach(booking => {
        const hourIndex = parseInt(booking.hour, 10);
        allHours[hourIndex] = { ...booking };
    });

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