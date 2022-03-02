import styles from './styles.module.scss';

import {
    defaultStaticRanges,
    defaultInputRanges
} from "react-date-range/dist/defaultRanges";
import pt from 'date-fns/locale/pt-BR';
import { addDays } from 'date-fns';
import { DateRangePicker } from 'react-date-range';

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { useState } from 'react';
import { FaCalendar } from 'react-icons/fa';

interface Link {
    id: string;
    title: string;
    order: number;
    url: string;
    dateStart: Date;
    dateStartFormatted: string;
    dateEnd: Date;
    dateEndFormatted: string;
    visits_count: number;
    updatedAt: string;
}

const CustomCalendarPicker = props => {
    const staticRangesLabels = {
        "Today": "Hoje",
        "Yesterday": "Ontem",
        "This Week": "Essa semana",
        "Last Week": "Semana passada",
        "This Month": "Esse mês",
        "Last Month": "Mês passado"
    };

    const inputRangesLabels = {
        "days up to today": "dias atrás até hoje",
        "days starting today": "dias a partir de hoje"
    };

    function translateRange(dictionary) {
        return (item) =>
            dictionary[item.label] ? { ...item, label: dictionary[item.label] } : item;
    }

    const ruStaticRanges = defaultStaticRanges.map(translateRange(staticRangesLabels));
    const ruInputRanges = defaultInputRanges.map(translateRange(inputRangesLabels));

    const [linkCalendar, setLinkCalendar] = useState(null);
    const [calendarRange, setCalendarRange] = useState([
        {
            startDate: new Date(),
            endDate: addDays(new Date(), 7),
            key: 'selection'
        }
    ]);

    const handleCalendarClick = async (link?: Link) => {
        if (link) {
            if (link.id === linkCalendar) {
                // if click on calendar icon again, closes calendar
                setLinkCalendar(null);

                return;
            }

            // check if link has a start date
            const calendarStart = (link.dateStart) ? link.dateStart : new Date();
            // check if link has an end date
            const calendarEnd = (link.dateEnd) ? link.dateEnd : addDays(new Date(), 7);

            setCalendarRange([{
                startDate: new Date(calendarStart),
                endDate: new Date(calendarEnd),
                key: 'selection'
            }]);

            setLinkCalendar(link.id);
        } else {
            // if null, "cleans" linkCalendar, i.e., closes calendar
            setLinkCalendar(null);
        }
    }

    const handleCalendarChange = async (ranges, link: Link) => {
        try {
            // handle Calendar Change in parent page that calls this child component (because there's specific handling for each page)
            const calendarChanged = await props.handleCalendarChange(ranges, link);

            if (calendarChanged) {
                // update calendar range
                setCalendarRange([ranges.selection]);
                // close calendar
                handleCalendarClick(null);
            }
        } catch (err) {

        }
    }

    return (
        <>
            <i className={styles.calendarIcon} onClick={() => handleCalendarClick(props.link)} >
                <FaCalendar />
            </i>
            {(linkCalendar === props.link.id) &&
                <DateRangePicker
                    ranges={calendarRange}
                    onChange={(ranges) => handleCalendarChange(ranges, props.link)}
                    locale={pt}
                    staticRanges={ruStaticRanges}
                    inputRanges={ruInputRanges}
                    dateDisplayFormat={"dd.MM.yyyy"}
                />
            }
        </>
    );
}

export default CustomCalendarPicker;