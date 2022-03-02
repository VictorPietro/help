import { isAfter, isBefore, isToday } from "date-fns";

const areDatesInRange = (dateStart?: Date, dateEnd?: Date) => {
    if (!dateStart || !dateEnd) {
        // console.log('TRUE: all null')
        return true;
    }

    dateStart = new Date(dateStart);
    dateEnd = new Date(dateEnd);

    const isStartToday = isToday(dateStart);
    const isEndToday = isToday(dateEnd);

    // if it starts or ends today, it will always be in range
    if (isStartToday || isEndToday) {
        // console.log('TRUE: starts or ends today')
        return true;
    }

    const today = new Date();

    // isAfter can't be true
    const isStartAfterToday = isAfter(dateStart, today);

    // isBefore can't be true
    const isEndBeforeToday = isBefore(dateEnd, today);

    // is it doesn't start after today and doesn't end before today
    if (!isStartAfterToday && !isEndBeforeToday) {
        // console.log('TRUE: starts before today and ends after today')
        return true;
    }

    // console.log('FALSE: none')
    return false;
}

export { areDatesInRange };