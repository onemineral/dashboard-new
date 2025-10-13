import {
    CalendarDate,
    CalendarDayInfo,
    CalendarEventInfo,
    CalendarResourceDayData
} from "@/components/application/calendar/types.ts";
import useSingleCalendarStore from "@/components/application/calendar/single/store/useSingleCalendarStore.ts";
import React, {ReactNode, useEffect, useState} from "react";
import {format, isSameMonth, isSameWeek} from "date-fns";
import {cn} from "@/lib/utils.ts";

type SingleCalendarGroupMonth = {
    firstDayOfMonth: Date;
    weeks: any[]
};

type SingleCalendarGroupWeek = {
    firstDayOfWeekOffset: number;
    days: CalendarDate[];
};

const getMonthWeeksGroups = (dates: CalendarDate[]): SingleCalendarGroupMonth[] => {
    const groups: SingleCalendarGroupMonth[] = [];

    let currentMonthGroup: SingleCalendarGroupMonth | null = null;
    let currentWeekGroup: SingleCalendarGroupWeek | null = null;

    dates.forEach((date) => {
        if (currentMonthGroup === null || !isSameMonth(date.date, currentMonthGroup.firstDayOfMonth)) {
            if(currentMonthGroup !== null) {
                currentMonthGroup.weeks.push(currentWeekGroup);
                groups.push(currentMonthGroup);
            }

            currentMonthGroup = {
                firstDayOfMonth: date.date,
                weeks: []
            };

            currentWeekGroup = null;
        }

        if (currentWeekGroup === null || !isSameWeek(date.date, currentWeekGroup.days[0].date, {weekStartsOn: 1})) {
            if(currentWeekGroup !== null) {
                currentMonthGroup.weeks.push(currentWeekGroup);
            }

            currentWeekGroup = {
                firstDayOfWeekOffset: date.date.getDay() ? date.date.getDay() - 1 : 6,
                days: []
            };
        }

        currentWeekGroup.days.push(date);
        // currentWeekGroup.lastDayOfWeekOffset = 6 - date.date.getDay();
    });

    if(currentWeekGroup !== null && currentMonthGroup !== null) {
        (currentMonthGroup as any).weeks.push(currentWeekGroup);
    }

    if(currentMonthGroup !== null) {
        groups.push(currentMonthGroup)
    }

    return groups;
}

export type SingleCalendarDayElementProp = {
    date: CalendarDate;
    dayInfo: CalendarResourceDayData;
    prevDayInfo?: CalendarResourceDayData;
    isSelected: boolean;
} & React.HTMLProps<HTMLDivElement>;

const DayNameHeader = ({children, isWeekend}: {children: ReactNode, isWeekend: boolean}) => {
    return <div className={cn('text-center font-bold text-xs py-1 border rounded w-full p-3', {
        'bg-sky-300/10': isWeekend,
        // 'border-foreground': props.isHovered,
    })}>{children}</div>;
}

export default function SingleCalendar({
                                           eventsData,
                                           daysData,
                                           startDate,
                                           endDate,
    renderDayElement
                                       }: {
    renderDayElement: React.Component<SingleCalendarDayElementProp>;
    eventsData: CalendarEventInfo[];
    daysData: CalendarDayInfo[];
    startDate: Date;
    endDate: Date;
}) {
    const dates = useSingleCalendarStore((state) => state.dates);
    const setDates = useSingleCalendarStore((state) => state.setDates);
    const addDaysAndEventData = useSingleCalendarStore((state) => state.addDaysAndEventData);
    const dateStringsToIndex = useSingleCalendarStore((state) => state.dateStringsToIndex);

    const [dateGroups, setDateGroups] = useState<SingleCalendarGroupMonth[]>([]);


    useEffect(() => {
        addDaysAndEventData(daysData, eventsData);
    }, [daysData, eventsData]);

    useEffect(() => {
        setDates(startDate, endDate);
    }, [startDate, endDate]);

    useEffect(() => {
        setDateGroups(getMonthWeeksGroups(dates));
    }, [dates]);

    const RenderDayElement = renderDayElement;

    return (
        <div className={'w-full'}>
            <div className={'sticky top-0 pt-4 z-2 flex w-full justify-between space-x-1 bg-background'}>
                <DayNameHeader isWeekend={false}>Mon</DayNameHeader>
                <DayNameHeader isWeekend={false}>Tue</DayNameHeader>
                <DayNameHeader isWeekend={false}>Wed</DayNameHeader>
                <DayNameHeader isWeekend={false}>Thu</DayNameHeader>
                <DayNameHeader isWeekend={false}>Fri</DayNameHeader>
                <DayNameHeader isWeekend={true}>Sat</DayNameHeader>
                <DayNameHeader isWeekend={true}>Sun</DayNameHeader>
            </div>
            {dateGroups.map((monthGroup: SingleCalendarGroupMonth, monthIndex: number) => (
                <div key={monthIndex} className={'mt-6 z-10 mb-12'}>
                    <h2 className={'font-bold text-lg'}>{format(monthGroup.firstDayOfMonth, 'MMMM yyyy')}</h2>
                    {monthGroup.weeks.map((weekGroup: SingleCalendarGroupWeek) => (
                        <div className={'w-full grid grid-cols-7 gap-1'} key={weekGroup.days[0].formattedDate}>
                            {Array.from({length: weekGroup.firstDayOfWeekOffset}).map((_, index) => (
                                <div key={index}>
                                    &nbsp;
                                </div>
                            ))}
                            {weekGroup.days.map((day: CalendarDate) => (
                                // @ts-ignore
                                <RenderDayElement key={day.formattedDate}
                                                  className={'w-full'}
                                                  date={day}
                                                  dayInfo={daysData[dateStringsToIndex[day.formattedDate]]}
                                                  prevDayInfo={daysData[dateStringsToIndex[day.formattedDate] - 1]}

                                >
                                    {day.formattedDate}
                                </RenderDayElement>
                            ))}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}