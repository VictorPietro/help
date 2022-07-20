import moment from "moment";

function addDays(date, number) {
    const newDate = new Date(date);
    return new Date(newDate.setDate(date.getDate() + number));
}

function addMonths(date, number) {
    const newDate = new Date(date);
    return new Date(newDate.setMonth(newDate.getMonth() + number));
}

function addYears(date, number) {
    const newDate = new Date(date);
    return new Date(newDate.setFullYear(newDate.getFullYear() + number));
}

const calculateBusinessDaysInterval = (start, end) => {
    start = moment(start);
    start = start.utc().add(start.utcOffset(), 'm'); // Ignore timezones

    end = moment(end);
    end = end.utc().add(end.utcOffset(), 'm'); // Ignore timezones

    var first = start.clone().endOf('week'); // end of first week
    var last = end.clone().startOf('week'); // start of last week

    // Fixing Summer Time problems
    var firstCorrection = moment(first).utc().add(60, 'm').toDate(); //
    var days = last.diff(firstCorrection, 'days') * 5 / 7; // this will always multiply of 7

    var wfirst = first.day() - start.day(); // check first week
    if (start.day() == 0) --wfirst; // -1 if start with sunday
    var wlast = end.day() - last.day(); // check last week
    if (end.day() == 6) --wlast; // -1 if end with saturday

    return wfirst + days + wlast; // get the total (subtract holidays if needed)
};

export { calculateBusinessDaysInterval, addDays, addMonths, addYears };
