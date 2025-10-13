import React, {useEffect, useRef, useState} from "react";
import {addMonths, differenceInDays, format, subMonths} from "date-fns";
import {cn} from "@/lib/utils.ts";
import useMultiCalendarStore from "@/components/application/calendar/multi/store/useMultiCalendarStore.ts";
import {
    CalendarDate,
    CalendarEventInfo,
    CalendarResource,
    CalendarResourceDayData
} from "@/components/application/calendar/types.ts";

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
                                          onDateRangeSelected,
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

    if(!dates.length) {
        const startDate = subMonths(new Date(), pastMonthsToRender);
        const endDate = addMonths(new Date(), futureMonthsToRender);

        setDates(startDate, endDate);
    }

    useEffect(() => {
        setResources(resources);
    }, [resources]);

    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({width: 0, height: 0, visibleRows: 0, visibleColumns: 0});
    const [hideContainer, setHideContainer] = useState(true);

    const setVisibleDatesIndexes = useMultiCalendarStore((state) => state.setVisibleDatesIndexes);
    const setVisibleResourcesIndexes = useMultiCalendarStore((state) => state.setVisibleResourcesIndexes);

    const getMissingDataToLoad = useMultiCalendarStore((state) => state.getMissingDataToLoad);
    const addDaysData = useMultiCalendarStore((state) => state.addDaysAndEventData);
    const getResourceDatesSelection = useMultiCalendarStore((state) => state.getResourceDatesSelection);
    const clearResourceDateSelection = useMultiCalendarStore((state) => state.clearResourceDateSelection);

    useEffect(() => {
        if (!containerRef.current) {
            return;
        }

        const containerElement = containerRef.current;

        const handleResize = () => {
            setHideContainer(true);

            setTimeout(() => {
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
                    width: width,
                    // @ts-ignore
                    height: height,
                    visibleRows: Math.ceil(height / (dayCellHeight + resourceRowHeight)),
                    visibleColumns: Math.ceil(width / dayCellWidth),
                });
                setHideContainer(false);
            }, 100);
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        const handleMouseUp = () => {
            const selection = getResourceDatesSelection();
            if (selection) {
                onDateRangeSelected?.(selection.resource, selection.start, selection.end);
                clearResourceDateSelection();
            }
        };

        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('mouseup', handleMouseUp);
        };

    }, []);

    useEffect(() => {
        if(dates.length && containerRef.current && !hideContainer) {
            console.log('scrolling to today');
            const daysToPresent = differenceInDays(new Date(), dates[0].date);
            containerRef.current.scrollLeft = Math.max(daysToPresent, 0) * (dayCellWidth + 4);
        }
    }, [dates, hideContainer]);



    return <div
        className={cn('overflow-auto relative', {
            'hidden': hideContainer,
        })}
        ref={containerRef}
        style={dimensions.width ? {
            width: dimensions.width + 'px',
            height: dimensions.height + 'px',
        } : {}}
        onScroll={(event) => {
            event.preventDefault();

            // calculate first row to display based on scroll top position
            const firstRowIndex = Math.floor(event.currentTarget.scrollTop / (dayCellHeight + resourceRowHeight));
            const minRow = Math.max(0, firstRowIndex - 3);
            const maxRow = Math.min(resources.length, firstRowIndex + dimensions.visibleRows + 3);

            // calculate first column to display based on scroll left position
            const firstColumnIndex = Math.floor(event.currentTarget.scrollLeft / (dayCellWidth + 4));
            const minColumn = Math.max(0, firstColumnIndex - 3);
            const maxColumn = Math.min(dates.length, firstColumnIndex + dimensions.visibleColumns + 3);

            const newRows = Array.from({length: maxRow - minRow}, (_, i) => minRow + i);
            const newColumns = Array.from({length: maxColumn - minColumn}, (_, i) => minColumn + i);

            setVisibleResourcesIndexes(newRows);
            setVisibleDatesIndexes(newColumns);

            if(throttleInProgress.current) {
                clearTimeout(throttleInProgress.current);
            }

            // @ts-ignore
            throttleInProgress.current = setTimeout(() => {
                const missingData = getMissingDataToLoad(
                    newRows,
                    newColumns[0],
                    newColumns[newColumns.length - 1]
                );

                if (missingData) {
                    onLoadMissingData(missingData.resources, missingData.start, missingData.end).then((data: CalendarResourceDayData[]) => {
                        addDaysData(data);
                    });
                }
            }, 100);
        }}
    >
        <div className={'flex flex-col'}
             style={{
                 height: `${(dayCellHeight + resourceRowHeight) * resources.length}px`,
                 width: `${dates.length * (dayCellWidth + 4)}px`,
                 position: 'relative',
             }}
        >
            <MulticalendarHeader renderDayHeaderElement={renderDayHeaderElement} dayCellWidth={dayCellWidth} />

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
};

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

    return <div className={'flex sticky top-0 z-2 bg-background pb-1'}>
        {datesGroupedByMonth.map((groupedMonth, index) => (
            <div key={index} className={'flex'}>
                <div>
                    <div className={'sticky left-0 w-fit text-sm font-bold mb-1 p-1'}>
                        {format(groupedMonth.firstDayOfMonth, 'MMM yyyy')}
                    </div>
                    <div className={'flex space-x-1'}>
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
    const rowSize = useMultiCalendarStore((state) => state.rowSizes[rowIndex]);
    const setResourceRowSize = useMultiCalendarStore((state) => state.setResourceRowSize);

    const multicalendarEvents = getEventsForResource(rowIndex, visibleDatesIndexes);

    const eventsSize = eventRowHeight * multicalendarEvents.maxOverlappingEvents;
    const newRowHeight = dayCellHeight + eventsSize;

    if(rowSize !== newRowHeight) {
        setResourceRowSize(rowIndex, newRowHeight);
    }


    return (
        <div className={'relative'} style={{
            height: rowSize,
        }}>
            {visibleDatesIndexes.map((col: number) => <MulticalendarCol
                key={col}
                colIndex={col}
                rowIndex={rowIndex}
                dayCellWidth={dayCellWidth}
                allowSelection={allowSelection}
                allowSelectInPast={allowSelectInPast}
                renderDayElement={renderDayElement}
                totalHeight={rowSize}
            />)}

            <div className={'absolute w-full'} style={{
                height: eventsSize,
                top: 1
            }}>
                <RenderEvents renderEventElement={renderEventElement}
                              events={multicalendarEvents.events}
                              eventRowHeight={eventRowHeight}
                              dayCellWidth={dayCellWidth}
                              rowIndex={rowIndex}
                />
            </div>
        </div>
    );
}

const RenderEvents = ({rowIndex, renderEventElement, events, eventRowHeight, dayCellWidth}: any) => {
    const dates = useMultiCalendarStore((state) => state.dates);
    const resource = useMultiCalendarStore((state) => state.resources[rowIndex]);

    const EventElement = renderEventElement;


    return <div className={'absolute'}>
        {events?.map((event: CalendarEventInfo) => {
            const leftPosition = (dayCellWidth + 4) * differenceInDays(event.start, dates[0].date) + dayCellWidth / 3;
            const eventWidth = (dayCellWidth + 4) * differenceInDays(event.end, event.start);

            return <EventElement key={event.id}
                                 resource={resource}
                                 event={event}
                                 className={'absolute'}
                                 style={{
                                     top: `${(event.calendarPosition - 1) * eventRowHeight}px`,
                                     left: leftPosition,
                                     width: eventWidth,
                                     height: `${eventRowHeight}px`,
                                 }}
            />;

        })}
    </div>;
}

const MulticalendarCol = ({
                              colIndex,
                              rowIndex,
                              dayCellWidth,
                              allowSelection,
                              allowSelectInPast,
                              renderDayElement,
                              totalHeight,
                          }: any) => {
    const resources = useMultiCalendarStore((state) => state.resources);
    const dates = useMultiCalendarStore((state) => state.dates);
    const selectedDates = useMultiCalendarStore((state) => state.resourceDatesSelection);
    const addDateSelection = useMultiCalendarStore((state) => state.addDateSelection);
    const startDateSelection = useMultiCalendarStore((state) => state.startDateSelection);
    const setHoveredDateIndex = useMultiCalendarStore((state) => state.setHoveredDateIndex);

    const isDraggable = allowSelection && (allowSelectInPast || !dates[colIndex].isPast);
    const rowDayData = useMultiCalendarStore((state) => state.dayData[rowIndex]);

    const DayElement = renderDayElement;


    return <DayElement
        resource={resources[rowIndex]}
        date={dates[colIndex]}
        dayInfo={rowDayData[colIndex]}
        prevDayInfo={rowDayData[colIndex - 1]}
        isSelected={selectedDates[rowIndex] && selectedDates[rowIndex].start <= colIndex && selectedDates[rowIndex].end >= colIndex}
        draggable={isDraggable}
        onDragStart={isDraggable ? (e: DragEvent) => {
            e.dataTransfer?.setDragImage(dragImg, 0, 0);
            startDateSelection(rowIndex, colIndex);
            e.preventDefault();
        } : undefined}
        onMouseOver={() => {
            if(isDraggable) {
                addDateSelection(colIndex);
            }
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