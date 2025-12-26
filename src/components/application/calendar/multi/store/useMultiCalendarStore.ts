import {create} from "zustand";
import {areIntervalsOverlapping, eachDayOfInterval, format, isPast, isToday, isWeekend, startOfMonth} from "date-fns";
import {YMD_FORMAT} from "@/lib/utils.ts";
import {
    CalendarDate,
    CalendarDayInfo,
    CalendarEventInfo, CalendarMissingData,
    CalendarResource, CalendarResourceDayData
} from "@/components/application/calendar/types.ts";

export type MultiCalendarStore = {
    dayData: {[key: number]: {[key: number]: CalendarDayInfo}},
    eventData: {[key: number]: CalendarEventInfo[]},
    resources: CalendarResource[],
    rowSizes: {[key: number]: number},
    dates: CalendarDate[],
    dateStringsToIndex: {[key: string]: number},
    datesGroupedByMonth: {firstDayOfMonth: Date, days: CalendarDate[]}[],

    hoveredDateIndexes: {[key: number]: boolean};
    setHoveredDateIndex: (index: number | null) => void;

    setResourceRowSize: (index: number, size: number) => void;

    visibleDatesIndexes: number[];
    visibleResourcesIndexes: number[];
    setVisibleDatesIndexes: (indexes: number[]) => void;
    setVisibleResourcesIndexes: (indexes: number[]) => void;

    startDateSelection: (resourceIndex: number, dateIndex: number) => void;
    addDateSelection: (dateIndex: number) => void;
    clearResourceDateSelection: () => void;
    getResourceDatesSelection: () => {resource: CalendarResource, start: Date, end: Date} | null;

    resourceDatesSelection: {[key: number]: {start: number, end: number}};

    setResources: (resources: any[]) => void;
    setDates: (start: Date, end: Date) => void;
    addDaysAndEventData: (data: CalendarResourceDayData[]) => void;

    clearDaysData: (resourceIndex: number, startDate: string, endDate: string) => void;

    getMissingDataToLoad: () => CalendarMissingData | null;
    getEventsForResource: (resourceIndex: number, datesIndexes: number[]) => {maxOverlappingEvents: number; events: CalendarEventInfo[]};
};

const setDatesGroupedByMonth = (dates: CalendarDate[]) => {
    const datesGroupedByMonth: {firstDayOfMonth: Date, days: CalendarDate[]}[] = [];

    let currentMonth: Date | null = null;
    let currentMonthDays: CalendarDate[] = [];

    dates.forEach((date) => {
        if (!currentMonth || currentMonth.getMonth() !== date.date.getMonth() || currentMonth.getFullYear() !== date.date.getFullYear()) {
            if (currentMonth) {
                datesGroupedByMonth.push({
                    firstDayOfMonth: currentMonth,
                    days: currentMonthDays,
                });
            }
            currentMonth = startOfMonth(date.date);
            currentMonthDays = [];
        }
        currentMonthDays.push(date);
    });

    if (currentMonth && currentMonthDays.length) {
        datesGroupedByMonth.push({
            firstDayOfMonth: currentMonth,
            days: currentMonthDays,
        });
    }

    return datesGroupedByMonth;
};

const useMultiCalendarStore = create<MultiCalendarStore>((set, get) => ({
    dayData: {},
    eventData: {},
    resources: [],
    rowSizes: {},
    resourcesIdToIndex: {},
    dates: [],
    dateStringsToIndex: {},
    datesGroupedByMonth: [],

    hoveredDateIndexes: {},

    visibleDatesIndexes: [],
    visibleResourcesIndexes: [],

    resourceDatesSelection: {},

    setHoveredDateIndex: (index: number | null) => {
        set({
            hoveredDateIndexes: index !== null ? {[index]: true} : {},
        });
    },

    setResources: (resources) => {
        const dayData: {[key: number]: {[key: number]: CalendarDayInfo}} = {};
        const eventData: {[key: number]: CalendarEventInfo[]} = {};

        resources.forEach((resource: any) => {
            dayData[resource.id] = {};
            eventData[resource.id] = [];
        });

        set({resources, eventData, dayData});
    },

    setResourceRowSize: (index: number, size: number) => {
        const {rowSizes} = get();
        if(rowSizes[index] === size) {
            return;
        }

        rowSizes[index] = size;
        set({
            rowSizes: {...rowSizes},
        });
    },

    setDates: (start, end) => {
        const dateStringsToIndex: {[key: string]: number} = {};
        const dates = eachDayOfInterval({start, end}).map((date: Date, index) => {
            const formatted = format(date, YMD_FORMAT);
            dateStringsToIndex[formatted] = index;
            return {
                date,
                formattedDate: formatted,
                isPast: isPast(date) && !isToday(date),
                isToday: isToday(date),
                isWeekend: isWeekend(date),
            };
        });

        set({
            dates,
            dateStringsToIndex,
            datesGroupedByMonth: setDatesGroupedByMonth(dates),
        });
    },

    addDaysAndEventData: (data) => {
        const {dayData, dateStringsToIndex, eventData} = get();

        const newDayData: {[key: number]: {[key: number]: CalendarDayInfo}} = {
            ...dayData,
        };

        const newEventData: {[key: number]: CalendarEventInfo[]} = {
            ...eventData,
        };

        data.forEach((resourceData) => {
            const resourceIndex = resourceData.id as number;
            const newDayInfo: {[key: number]: CalendarDayInfo} = {};
            resourceData.dayData.forEach((dayInfo: CalendarDayInfo) => {
                newDayInfo[dateStringsToIndex[dayInfo.date]] = dayInfo;
            });

            resourceData.eventData?.forEach((eventInfo: CalendarEventInfo) => {
                if(!eventData[resourceIndex].find((value) => value.id == eventInfo.id)) {
                    newEventData[resourceIndex].push(eventInfo);
                }
            });

            newDayData[resourceIndex] = {
                ...dayData[resourceIndex],
                ...newDayInfo,
            };

            newEventData[resourceIndex] = newEventData[resourceIndex].sort((a, b) => a.start.getTime() - b.start.getTime());
        });

        set(() => ({dayData: newDayData, eventData: newEventData}));
    },

    setVisibleDatesIndexes: (indexes) => {
        const {visibleDatesIndexes} = get();
        if(visibleDatesIndexes.length === indexes.length && visibleDatesIndexes.every((value, index) => value === indexes[index])) {
            return;
        }

        set({visibleDatesIndexes: indexes});
    },

    setVisibleResourcesIndexes: (indexes) => {
        const {visibleResourcesIndexes} = get();
        if(visibleResourcesIndexes.length === indexes.length && visibleResourcesIndexes.every((value, index) => value === indexes[index])) {
            return;
        }

        set({visibleResourcesIndexes: indexes});
    },

    getMissingDataToLoad: (): CalendarMissingData | null => {
        const {resources, dayData, dates, visibleResourcesIndexes, visibleDatesIndexes} = get();
        const startDayIndex = visibleDatesIndexes[0];
        const endDayIndex = visibleDatesIndexes[visibleDatesIndexes.length - 1];

        const missingResources: CalendarResource[] = [];
        let start: Date | null = null;
        let end: Date | null = null;

        visibleResourcesIndexes.forEach((resourceIndex) => {
            const resource = get().resources[resourceIndex];
            for(let i = startDayIndex; i <= endDayIndex; i++) {
                if (!dayData[resource.id][i]) {
                    if(!missingResources.includes(resources[resourceIndex])) {
                        missingResources.push(resources[resourceIndex]);
                    }
                    start = start && start < dates[i].date ? start : dates[i].date;
                    end = end && end > dates[i].date ? end : dates[i].date;
                }
            }
        });

        if (start && end) {
            return {
                resources: missingResources,
                start: format(start, YMD_FORMAT),
                end: format(end, YMD_FORMAT),
            }
        }

        return null;
    },

    clearDaysData: (resourceId, startDate, endDate) => {
        const {dayData, dateStringsToIndex} = get();

        // Parse start and end dates
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        // Get all dates in the range
        const datesInRange = eachDayOfInterval({start, end});
        
        // Delete day data for each date in the range
        datesInRange.forEach((date) => {
            const dateString = format(date, YMD_FORMAT);
            const dateIndex = dateStringsToIndex[dateString];

            delete dayData[resourceId]?.[dateIndex];
        });
        
        // Update the store
        set({
            dayData
        });
    },

    getEventsForResource: (resourceIndex, datesIndexes) => {
        const {eventData, dates} = get();
        const events: CalendarEventInfo[] = [];
        let maxOverlappingEvents = 0;

        if(dates.length && datesIndexes.length) {
            const visibleDateRange = {
                start: dates[datesIndexes[0]].date,
                end: dates[datesIndexes[datesIndexes.length - 1]].date,
            };

            eventData[resourceIndex].forEach((event) => {
                if (areIntervalsOverlapping(event, visibleDateRange)) {
                    // get the overlap position
                    event.overlappingEvents = events.filter((e) => areIntervalsOverlapping(e, event));

                    if (!event.overlappingEvents.length) {
                        event.calendarPosition = 1;
                    } else if (event.overlappingEvents.length === 1) {
                        event.calendarPosition = event.overlappingEvents[0].calendarPosition == 1 ? 2 : event.overlappingEvents[0].calendarPosition - 1;
                    } else {
                        const overlappingPositions: number[] = event.overlappingEvents.map((e: CalendarEventInfo) => e.calendarPosition).sort((a: number, b: number) => a - b);
                        for (let i = 1; i < overlappingPositions.length; i++) {
                            if (overlappingPositions[i + 1] - overlappingPositions[i] > 1) {
                                event.calendarPosition = overlappingPositions[i] + 1;
                                break;
                            }
                        }

                        if (!event.calendarPosition) {
                            event.calendarPosition = overlappingPositions[overlappingPositions.length - 1] + 1;
                        }
                    }

                    maxOverlappingEvents = Math.max(maxOverlappingEvents, event.calendarPosition);
                    events.push(event);
                }
            });
        }

        return {
            maxOverlappingEvents,
            events: events.sort((a: CalendarEventInfo, b: CalendarEventInfo) => a.calendarPosition - b.calendarPosition),
        };
    },

    startDateSelection: (resourceIndex: number, dateIndex: number) => {
        set({
            resourceDatesSelection: {
                [resourceIndex]: {
                    start: dateIndex,
                    end: dateIndex,
                }
            }
        });
    },

    addDateSelection: (dateIndex: number) => {
        const {resourceDatesSelection} = get();

        if(!Object.keys(resourceDatesSelection).length) {
            return ;
        }

        // @ts-ignore
        Object.keys(resourceDatesSelection).forEach((index: number) => {
            if(resourceDatesSelection[index].end < dateIndex || resourceDatesSelection[index].start < dateIndex) {
                resourceDatesSelection[index].end = dateIndex;
            } else {
                resourceDatesSelection[index].start = dateIndex;
            }
        });

        set({
            resourceDatesSelection: {...resourceDatesSelection}
        });
    },

    clearResourceDateSelection: () => {
        set({
            resourceDatesSelection: {}
        });
    },

    getResourceDatesSelection: () => {
        const {resourceDatesSelection} = get();

        if(!Object.keys(resourceDatesSelection).length) {
            return null;
        }

        // @ts-ignore
        const selection = Object.keys(resourceDatesSelection).map((resourceIndex: number) => {
            return {
                resource: get().resources[resourceIndex],
                start: get().dates[resourceDatesSelection[resourceIndex].start].date,
                end: get().dates[resourceDatesSelection[resourceIndex].end].date,
            }
        });

        return selection?.[0];
    },

}));

export default useMultiCalendarStore;