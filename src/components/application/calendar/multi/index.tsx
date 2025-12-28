import React, {useEffect, useEffectEvent, useRef, useState} from "react";
import {addMonths, differenceInDays, format, subMonths} from "date-fns";
import {cn} from "@/lib/utils.ts";
import useMultiCalendarStore from "@/components/application/calendar/multi/store/useMultiCalendarStore.ts";
import {
    CalendarDate,
    CalendarEventInfo,
    CalendarResource,
    CalendarResourceDayData
} from "@/components/application/calendar/types.ts";
import {useEventListener} from "@/hooks/use-event-listener.ts";
import CalendarSelectionSheet from "@/pages/pms/properties/components/calendar-selection-sheet.tsx";

export type MulticalendarDayElementProp = {
    date: CalendarDate;
    resource: CalendarResource;
    dayInfo: CalendarResourceDayData;
    prevDayInfo: CalendarResourceDayData;
    isSelected: boolean;
} & React.HTMLProps<HTMLDivElement>;

export type MulticalendarResourceElementProp = {
    resource: CalendarResource;
} & React.HTMLProps<HTMLDivElement>;

export type MulticalendarEventElementProp = {
    resource: CalendarResource;
    event: CalendarEventInfo;
} & React.HTMLProps<HTMLDivElement>;

type MulticalendarProps = {
    onLoadMissingData: (resources: any, start: string, end: string) => Promise<CalendarResourceDayData[]>,
    renderDayElement: React.Component<MulticalendarDayElementProp>;
    renderEventElement?: React.Component<MulticalendarEventElementProp>;
    renderResourceElement: React.Component<MulticalendarResourceElementProp>;
    renderDayHeaderElement?: React.Component<{
        date: CalendarDate,
        cellWidth: number,
        isHovered: boolean,
    } & React.HTMLProps<HTMLDivElement>>;
    resources: any[];
    dayCellWidth?: number;
    dayCellHeight?: number;
    eventRowHeight?: number;
    resourceRowHeight?: number;
    onDateRangeSelected?: (resource: any, startDate: Date, endDate: Date) => void;
    allowSelection?: boolean;
    allowSelectInPast?: boolean;
    pastMonthsToRender?: number;
    futureMonthsToRender?: number;
};

type MulticalendarContainerProps = {
    renderDayElement: React.Component<MulticalendarDayElementProp>;
    renderEventElement?: React.Component<MulticalendarEventElementProp>;
    renderResourceElement: React.Component<MulticalendarResourceElementProp>;
    dayCellWidth: number;
    dayCellHeight: number;
    eventRowHeight: number;
    resourceRowHeight: number;
    allowSelection: boolean;
    allowSelectInPast: boolean;
};

const dragImg = new Image(0, 0);
dragImg.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

export const RenderDayHeader = ({date, cellWidth, className, style, ...props}: {
    date: CalendarDate,
    cellWidth: number
} & React.HTMLProps<HTMLDivElement>) => {
    return <div className={cn('text-center font-bold text-xs py-1 border rounded', className)}
                style={{width: cellWidth + 'px', ...style}}
                {...props}
    >
        {format(date.date, 'eee')} <br/>
        {date.date.getDate()}
    </div>;
}


export default function Multicalendar({
                                          resources,
                                          renderDayElement,
                                          renderEventElement,
                                          renderResourceElement,
                                          dayCellWidth = 70,
                                          dayCellHeight = 40,
                                          eventRowHeight = 40,
                                          resourceRowHeight = 45,
                                          onLoadMissingData,
                                          allowSelection = true,
                                          allowSelectInPast = false,
                                          // @ts-ignore
                                          renderDayHeaderElement = RenderDayHeader,
                                          pastMonthsToRender = 1,
                                          futureMonthsToRender = 24,
                                      }: MulticalendarProps) {

    const throttleInProgress = useRef<any>(null);

    const dates = useMultiCalendarStore((state) => state.dates);
    const setResources = useMultiCalendarStore((state) => state.setResources);
    const setDates = useMultiCalendarStore((state) => state.setDates);

    if (!dates.length) {
        const startDate = subMonths(new Date(), pastMonthsToRender);
        const endDate = addMonths(new Date(), futureMonthsToRender);

        setDates(startDate, endDate);
    }

    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({visibleRows: 0, visibleColumns: 0});

    const setVisibleDatesIndexes = useMultiCalendarStore((state) => state.setVisibleDatesIndexes);
    const setVisibleResourcesIndexes = useMultiCalendarStore((state) => state.setVisibleResourcesIndexes);

    const getMissingDataToLoad = useMultiCalendarStore((state) => state.getMissingDataToLoad);
    const addDaysData = useMultiCalendarStore((state) => state.addDaysAndEventData);
    const clearDaysData = useMultiCalendarStore((state) => state.clearDaysData);

    // Reusable function to calculate visible resource indexes
    const calculateVisibleResourcesIndexes = useEffectEvent((scrollTop: number) => {
        const firstRowIndex = Math.floor(scrollTop / (dayCellHeight + resourceRowHeight));
        const minRow = Math.max(0, firstRowIndex - 3);
        const maxRow = Math.min(resources.length, firstRowIndex + dimensions.visibleRows + 3);
        const newRows = Array.from({length: maxRow - minRow}, (_, i) => minRow + i);
        setVisibleResourcesIndexes(newRows);
    });

    const calculateVisibleColsIndexes = useEffectEvent((scrollLeft: number) => {
        // calculate first column to display based on scroll left position
        const firstColumnIndex = Math.floor(scrollLeft / (dayCellWidth + 4));
        const minColumn = Math.max(0, firstColumnIndex - 3);
        const maxColumn = Math.min(dates.length, firstColumnIndex + dimensions.visibleColumns + 3);

        const newColumns = Array.from({length: maxColumn - minColumn}, (_, i) => minColumn + i);

        setVisibleDatesIndexes(newColumns);
    })

    // Reusable function to scroll to a specific date
    const scrollToDate = useEffectEvent((targetDate: Date, smooth: boolean = false) => {
        if (dates.length && containerRef.current) {
            const daysToTarget = differenceInDays(targetDate, dates[0].date) - 2;
            const scrollLeft = Math.max(daysToTarget, 0) * (dayCellWidth + 4);

            if (smooth) {
                containerRef.current.scrollTo({
                    left: scrollLeft,
                    behavior: 'smooth'
                });
            } else {
                containerRef.current.scrollLeft = scrollLeft;
            }
        }
    });

    useEffect(() => {
        containerRef.current?.scrollTo({
            top: 0
        });
        setResources(resources);

        calculateVisibleResourcesIndexes(containerRef.current?.scrollTop || 0);
        attemptLoadData();
    }, [resources]);

    const handleResize = useEffectEvent(() => {
        const containerElement = containerRef.current;

        if (!containerElement) {
            return;
        }

        const cs = getComputedStyle(containerElement.parentNode as Element);

        const paddingX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
        const paddingY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);

        const borderX = parseFloat(cs.borderLeftWidth) + parseFloat(cs.borderRightWidth);
        const borderY = parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);

        // @ts-ignore
        const height = containerElement.parentNode.offsetHeight - paddingY - borderY;
        // @ts-ignore
        const width = containerElement.parentNode.offsetWidth - paddingX - borderX;
        setDimensions({
            // @ts-ignore
            visibleRows: Math.ceil(height / (dayCellHeight + resourceRowHeight)),
            visibleColumns: Math.ceil(width / dayCellWidth),
        });

        calculateVisibleColsIndexes(containerElement.scrollLeft);
        calculateVisibleResourcesIndexes(containerElement.scrollTop);
        attemptLoadData();
    });

    useEffect(() => {
        handleResize();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };

    }, []);

    // @ts-ignore
    useEventListener('multicalendar:scrollToDate', (e: CustomEvent) => {
        const targetDate = e.detail?.date ? new Date(e.detail.date) : new Date();
        scrollToDate(targetDate, true);
    });
    // @ts-ignore
    useEventListener('multicalendar:calendar-updated', (e: CustomEvent) => {
        clearDaysData(e.detail.property.id, e.detail.daterange.start, e.detail.daterange.end);
        attemptLoadData();
    });

    useEffect(() => {
        scrollToDate(new Date(), false);
    }, []);

    const attemptLoadData = () => {
        if (throttleInProgress.current) {
            clearTimeout(throttleInProgress.current);
        }

        // @ts-ignore
        throttleInProgress.current = setTimeout(() => {
            // Get current visible resources from store
            const missingData = getMissingDataToLoad();

            if (missingData) {
                onLoadMissingData(missingData.resources, missingData.start, missingData.end).then((data: CalendarResourceDayData[]) => {
                    addDaysData(data);
                });
            }
        }, 300);
    };


    return <>
        <div className={'relative w-full flex flex-1'}>
            <div
                className={cn('overflow-auto max-w-full absolute inset-0 scrollbar-thin')}
                ref={containerRef}
                onScroll={(event) => {
                    event.preventDefault();
                    calculateVisibleResourcesIndexes(event.currentTarget.scrollTop);
                    calculateVisibleColsIndexes(event.currentTarget.scrollLeft);
                    attemptLoadData();
                }}
            >
                <div className={'flex flex-col'}
                     style={{
                         width: `${dates.length * (dayCellWidth + 4)}px`,
                         height: `${((dayCellHeight + resourceRowHeight) * resources.length)}px`,
                         position: 'relative',
                     }}
                >
                    <MulticalendarHeader renderDayHeaderElement={renderDayHeaderElement} dayCellWidth={dayCellWidth}/>

                    {dates.length > 0 && <MulticalendarContent
                        renderDayElement={renderDayElement}
                        renderEventElement={renderEventElement}
                        renderResourceElement={renderResourceElement}
                        dayCellWidth={dayCellWidth}
                        dayCellHeight={dayCellHeight}
                        eventRowHeight={eventRowHeight}
                        resourceRowHeight={resourceRowHeight}
                        allowSelection={allowSelection}
                        allowSelectInPast={allowSelectInPast}
                    />}
                </div>
            </div>
        </div>
        <CalendarSelectionSheet/>
    </>;
}

const MulticalendarHeader = ({
                                 renderDayHeaderElement,
                                 dayCellWidth,
                             }: {
    renderDayHeaderElement: React.Component<{
        date: CalendarDate,
        cellWidth: number,
        isHovered: boolean,
    } & React.HTMLProps<HTMLDivElement>>;
    dayCellWidth: number;
}) => {

    const datesGroupedByMonth = useMultiCalendarStore((state) => state.datesGroupedByMonth);

    return <div className={'flex sticky top-0 z-20 bg-background pb-1'}>
        {datesGroupedByMonth.map((groupedMonth, index) => (
            <div key={index} className={'flex'}>
                <div>
                    <div className={'sticky left-0 w-fit text-sm font-bold mb-1 p-1'}>
                        {format(groupedMonth.firstDayOfMonth, 'MMM yyyy')}
                    </div>
                    <div className={'flex space-x-[4px]'}>
                        {/*@ts-ignore*/}
                        {groupedMonth.days.map((date) => <MulticalendarHeaderDayElement
                            key={date.formattedDate}
                            date={date}
                            dayCellWidth={dayCellWidth}
                            renderDayHeaderElement={renderDayHeaderElement}
                        />)}
                    </div>
                </div>

                <div className={'border-r-2 border-foreground'} style={{
                    marginLeft: 1,
                    marginRight: 1,
                }}/>
            </div>
        ))}
    </div>;
}

const MulticalendarHeaderDayElement = ({date, dayCellWidth, renderDayHeaderElement}: {
    renderDayHeaderElement: React.Component<{
        date: CalendarDate,
        cellWidth: number,
        isHovered: boolean,
    } & React.HTMLProps<HTMLDivElement>>;
    dayCellWidth: number;
    date: CalendarDate;
}) => {
    const dateIndex = useMultiCalendarStore((state) => state.dateStringsToIndex[date.formattedDate]);
    const isHovered = useMultiCalendarStore((state) => state.hoveredDateIndexes[dateIndex]);
    const DayHeaderElement = renderDayHeaderElement;

    // @ts-ignore
    return <DayHeaderElement
        isHovered={isHovered}
        date={date}
        cellWidth={dayCellWidth}
    />;
}


const MulticalendarContent = ({
                                  renderDayElement,
                                  renderEventElement,
                                  renderResourceElement,
                                  dayCellWidth,
                                  dayCellHeight,
                                  eventRowHeight,
                                  resourceRowHeight,
                                  allowSelection,
                                  allowSelectInPast,
                              }: MulticalendarContainerProps) => {

    const visibleResourcesIndexes = useMultiCalendarStore((state) => state.visibleResourcesIndexes);
    const resources = useMultiCalendarStore((state) => state.resources);

    const ResourceElement = renderResourceElement;

    return (<>
            {visibleResourcesIndexes.map((row: number, _: number) =>
                <div className={'inline-flex w-full hover:underline'}
                     key={row}
                     style={{
                         marginTop: _ == 0 ? `${(dayCellHeight + dayCellHeight) * row}px` : 0,
                     }}>
                    <div className={'flex flex-col justify-beten w-full'}>
                        <div className="flex items-center sticky left-0 w-fit pb-2 pt-4" style={{
                            height: `${resourceRowHeight}px`,
                        }}>
                            {/*@ts-ignore*/}
                            <ResourceElement resource={resources[row]}/>
                        </div>
                        <MulticalendarRow
                            rowIndex={row}
                            resource={resources[row]}
                            eventRowHeight={eventRowHeight}
                            resourceRowHeight={resourceRowHeight}
                            dayCellHeight={dayCellHeight}
                            dayCellWidth={dayCellWidth}
                            allowSelectInPast={allowSelectInPast}
                            allowSelection={allowSelection}
                            renderEventElement={renderEventElement}
                            renderResourceElement={renderResourceElement}
                            renderDayElement={renderDayElement}
                            estimatedRowHeight={dayCellHeight}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

const MulticalendarRow = ({
                              rowIndex,
                              resource,
                              eventRowHeight,
                              dayCellHeight,
                              dayCellWidth,
                              allowSelectInPast,
                              allowSelection,
                              renderEventElement,
                              renderDayElement,
                          }: any) => {
    const getEventsForResource = useMultiCalendarStore((state) => state.getEventsForResource);
    const visibleDatesIndexes = useMultiCalendarStore((state) => state.visibleDatesIndexes);

    const multicalendarEvents = getEventsForResource(resource.id, visibleDatesIndexes);

    return (
        <div className={'relative'} style={{
            height: dayCellHeight,
        }}>
            {visibleDatesIndexes.map((col: number) => <MulticalendarCol
                key={col}
                colIndex={col}
                rowIndex={rowIndex}
                resource={resource}
                dayCellWidth={dayCellWidth}
                allowSelection={allowSelection}
                allowSelectInPast={allowSelectInPast}
                renderDayElement={renderDayElement}
                totalHeight={dayCellHeight}
            />)}

            <RenderEvents renderEventElement={renderEventElement}
                          events={multicalendarEvents.events}
                          eventRowHeight={eventRowHeight}
                          dayCellWidth={dayCellWidth}
                          rowIndex={rowIndex}
                          resource={resource}

            />
        </div>
    );
}

const RenderEvents = ({rowIndex, renderEventElement, events, eventRowHeight, dayCellWidth}: any) => {
    const dates = useMultiCalendarStore((state) => state.dates);
    const resource = useMultiCalendarStore((state) => state.resources[rowIndex]);

    const EventElement = renderEventElement;


    return <>
        {events?.map((event: CalendarEventInfo) => {
            const leftPosition = (dayCellWidth + 4) * differenceInDays(event.start, dates[0].date) + dayCellWidth / 3;
            const eventWidth = (dayCellWidth + 4) * differenceInDays(event.end, event.start);

            return <EventElement key={event.id}
                                 resource={resource}
                                 event={event}
                                 className={'absolute'}
                                 style={{
                                     left: leftPosition,
                                     width: eventWidth,
                                     height: `${eventRowHeight}px`,
                                 }}
            />;

        })}
    </>;
}

const MulticalendarCol = ({
                              colIndex,
                              rowIndex,
                              resource,
                              dayCellWidth,
                              allowSelection,
                              allowSelectInPast,
                              renderDayElement,
                              totalHeight,
                          }: any) => {
    const date = useMultiCalendarStore((state) => state.dates[colIndex]);
    const hasSelectedDates = useMultiCalendarStore((state) => !!state.resourceDatesSelection[rowIndex]);
    const addDateSelection = useMultiCalendarStore((state) => state.addDateSelection);
    const startDateSelection = useMultiCalendarStore((state) => state.setDateSelection);
    const setHoveredDateIndex = useMultiCalendarStore((state) => state.setHoveredDateIndex);
    const isSelected = useMultiCalendarStore(state => state.resourceDatesSelection[rowIndex] && state.resourceDatesSelection[rowIndex].start <= colIndex && state.resourceDatesSelection[rowIndex].end >= colIndex)
    const isDraggable = allowSelection && (allowSelectInPast || !date.isPast);
    const dayInfo = useMultiCalendarStore((state) => state.dayData[resource.id]?.[colIndex]);
    const prevDayInfo = useMultiCalendarStore((state) => state.dayData[resource.id]?.[colIndex - 1]);

    const DayElement = renderDayElement;

    return <DayElement
        resource={resource}
        date={date}
        dayInfo={dayInfo}
        prevDayInfo={prevDayInfo}
        isSelected={isSelected}
        onClick={() => {
            if (isDraggable) {
                if (hasSelectedDates) {
                    addDateSelection(colIndex);
                } else {
                    startDateSelection(rowIndex, colIndex);
                }
            }
        }}
        onMouseOver={() => {
            setHoveredDateIndex(colIndex);
        }}
        onMouseLeave={() => {
            setHoveredDateIndex(null);
        }}
        className={'absolute'}
        style={{
            left: colIndex * (dayCellWidth + 4),
            width: `${dayCellWidth}px`,
            height: totalHeight,
        }}
    />;
}