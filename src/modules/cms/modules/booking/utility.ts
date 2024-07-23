import * as moment from "moment";

export const countBookings = (bookings) => {
    // '2024-05-16T00:00:00Z'
    const today = moment(new Date('2024-05-16T00:00:00Z'));
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