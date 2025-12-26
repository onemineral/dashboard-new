import Multicalendar, {
    MulticalendarDayElementProp,
    MulticalendarEventElementProp,
    RenderDayHeader
} from "@/components/application/calendar/multi";
import {cn, formatDate, mergeObjects} from "@/lib/utils.ts";
import {toDate, addMonths, startOfMonth, format} from "date-fns";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import React, {useState, useMemo, useEffect} from "react";
import {useQuery} from "@tanstack/react-query";
import api from "@/lib/api.ts";
import {CalendarDate, CalendarResourceDayData} from "@/components/application/calendar/types.ts";
import {Page, PageContent} from "@/components/application/page.tsx";
import Link from "@/components/application/link.tsx";
import {Filters} from "@/components/application/filters/filters.tsx";
import useFiltersDefinition from "@/components/application/filters/hooks/use-filters-definition.tsx";
import {useDataTable} from "@/hooks/use-data-table.ts";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {useIntl} from "react-intl";
import BookingStatusBadge from "@/components/application/statuses/booking-status-badge.tsx";
import {Booking, Property, RatesAvailability} from "@sdk/generated";
import {useTranslate} from "@/hooks/use-translate.ts";
import CalendarSelectionSheet from "@/pages/pms/properties/components/calendar-selection-sheet.tsx";
import AutocompleteTextSearchFilter from "@/components/application/filters/types/autocomplete-text-search-filter.tsx";

const EventElement = (props: MulticalendarEventElementProp) => {
    const {event, className, ...divProps} = props;

    return <div className={cn(className, 'p-1 overflow-hidden inline-flex top-1 border-sky-950 rounded bg-sky-700')} {...divProps}>
        <Link modal to={`/calendar/${event.id}`}
              className={'px-1 sticky left-0 top-0 flex items-center text-xs text-white'}>
            <div className={' flex items-center text-ellipsis whitespace-nowrap max-w-full gap-1'}>
                {event.channel?.icon_url ? <Avatar className={'size-7 bg-white p-1'}>
                    <AvatarImage src={event.channel?.icon_url} alt={''} />
                </Avatar> : null}
                <span>{event.main_guest?.full_name}</span>
                <BookingStatusBadge status={event.status} />
            </div>
        </Link>
    </div>;
}

const DayElementRate = ({rate, prevRate, resource}: {
    rate: RatesAvailability | undefined,
    prevRate: RatesAvailability | undefined,
    resource: Property
}) => {
    const [showGlow, setShowGlow] = useState(false);

    useEffect(() => {
        if (!rate?.updated_at) return;

        // Parse the UTC timestamp and get current UTC time
        const updatedAt = new Date(rate.updated_at + 'Z');
        const nowUtc = new Date();
        
        // Calculate time difference in seconds (both dates are in UTC)
        const timeDiffSeconds = (nowUtc.getTime() - updatedAt.getTime()) / 1000;

        console.log(timeDiffSeconds);

        // Check if updated within last 5 seconds
        if (timeDiffSeconds >= 0 && timeDiffSeconds <= 10) {
            setShowGlow(true);
            
            // Remove the glow class after 2 seconds
            const timeout = setTimeout(() => {
                setShowGlow(false);
            }, 2000);

            return () => clearTimeout(timeout);
        }
    }, [rate?.updated_at]);

    return <>
        {rate ? (
            <>
                {rate.rate && rate.availability_status_type !== 'booked' ?
                    <div className={'text-xs mb-[18px] relative z-10'}>
                        {rate.rate?.toLocaleString(undefined, {
                            style: 'currency',
                            currency: resource.currency?.iso_code,
                            currencyDisplay: 'narrowSymbol',
                            minimumFractionDigits: 0,
                        })}
                    </div> : <div className={'rate-not-defined w-full h-full'}></div>}

                {/* Glow animation overlay */}
                {showGlow && (
                    <div
                        className="absolute inset-0 bg-yellow-400/30 rounded pointer-events-none"
                        style={{
                            animation: 'pulse-glow 2s ease-out',
                            zIndex: 5,
                            mixBlendMode: 'normal'
                        }}
                    />
                )}

                <div className={'bottom-0 absolute w-full flex z-10'}>
                    <div className={'w-1/3 h-1'}
                         style={prevRate ? {background: prevRate.availability_status?.calendar_color} : {}}></div>
                    <div className={'w-2/3 h-1'}
                         style={{background: rate.availability_status?.calendar_color}}></div>
                </div>
            </>
        ) : (<Skeleton className={'w-10 h-3 mb-[18px]'}/>)}
    </>;
};

const DayElement = (props: MulticalendarDayElementProp) => {
    // @ts-ignore
    const {resource, date, dayInfo, prevDayInfo, isSelected, ...divProps} = props;

    return <div
        {...divProps}
        draggable={props.draggable && !date.isPast}
        className={cn('border cursor-default rounded hover:border-foreground flex items-end justify-center text-sm relative overflow-hidden', props.className, {
            'border-yellow-400': date.isToday,
            'opacity-50': date.isPast,
            'bg-sky-300/10': date.isWeekend,
            'border-foreground': isSelected,
        })}>
        {/*@ts-ignore*/}
        <DayElementRate rate={dayInfo} prevRate={prevDayInfo} resource={resource}/>
    </div>;
};

const DayHeaderElement = (props: {
    date: CalendarDate,
    cellWidth: number,
    isHovered: boolean
} & React.HTMLProps<HTMLDivElement>) => {
    return <RenderDayHeader
        date={props.date}
        cellWidth={props.cellWidth}
        className={cn({
            'border-yellow-400': props.date.isToday,
            'opacity-50': props.date.isPast,
            'bg-sky-300/10': props.date.isWeekend,
            'border-foreground': props.isHovered,
        })}/>;
}

const ResourceElement = (props: { resource: Property } & React.HTMLProps<HTMLDivElement>) => {
    const translated = useTranslate();
    const {resource} = props;

    return <Link modal to={`/calendar/${resource.id}`}>
        <div className={'flex items-center w-fit text-sm font-bold space-x-2'}>
            <Avatar className="size-8 rounded-md">
                <AvatarImage src={resource.main_image?.thumbnail} alt={translated(resource.name)}/>
                <AvatarFallback className="text-xs rounded-md">
                    {translated(resource.name).slice(0, 2).toUpperCase()}
                </AvatarFallback>
            </Avatar>
            <span>{translated(resource.name)}</span>
        </div>
    </Link>;
};

export default function MultiCalendar() {
    const intl = useIntl();
    const [selectedProperty, setSelectedProperty] = useState<Property|null>(null);
    const [selectedDates, setSelectedDates] = useState<{start: string; end: string} | null>(null);
    
    // Generate month options from next month to 20 months in the future
    const monthOptions = useMemo(() => {
        const options = [
            {
                value: (new Date()).toISOString(),
                label: intl.formatMessage({
                    defaultMessage: 'Today',
                    description: 'Label for today in a select to move the calendar to the current date'
                }),
            }
        ];
        const today = new Date();
        
        for (let i = 1; i <= 20; i++) {
            const monthDate = startOfMonth(addMonths(today, i));
            options.push({
                value: monthDate.toISOString(),
                label: format(monthDate, 'MMMM yyyy'),
            });
        }
        
        return options;
    }, []);
    
    const handleMonthJump = (value: string) => {
        const selectedDate = new Date(value);
        const event = new CustomEvent('multicalendar:scrollToDate', {
            detail: { date: selectedDate }
        });
        window.dispatchEvent(event);
    };
    
    const availableFilters = useFiltersDefinition('property', [
        {
            name: 'name',
            featured: true,
            label: intl.formatMessage({
                defaultMessage: 'Name',
                description: 'Label for property name filter'
            }),
            component: <AutocompleteTextSearchFilter
                field={'name'}
                placeholder={intl.formatMessage({
                    defaultMessage: 'Search by property name',
                    description: 'Placeholder for property name search input'
                })}
            />,
        },
    ]);

    const {selectedFilters, setSelectedFilters, body} = useDataTable({
        initialSort: {field: 'id', direction: 'asc'},
    });

    const {isLoading: propertiesLoading, data: properties} = useQuery({
        queryKey: ['multicalendar-properties', body],
        queryFn: async () => {
            const response = await api.property.autocomplete(mergeObjects({limit: 50}, body));

            return response.response;
        }
    });

    const loadData = async (resources: Property[], start: string, end: string): Promise<CalendarResourceDayData[]> => {
        // load the data
        const response = await api.property.query({
            // @ts-ignore
            no_auto_relations: true,
            with_rates_and_bookings: {daterange: {start, end}},
            paginate: {
                perpage: 100,
            },
            where: {
                conditions: [{
                    field: 'id',
                    in: resources.map((resource) => resource.id),
                }]
            }
        });

        const formattedData: CalendarResourceDayData[] = [];

        response.response.data.forEach((property: Property) => {
            // key rates availability by day
            const data: CalendarResourceDayData = {
                id: property.id,
                dayData: [],
                eventData: [],
            };

            property.rates_availability?.forEach((rate: RatesAvailability) => {
                data.dayData.push({
                    date: rate.day,
                    ...rate,
                });
            });

            property.bookings?.forEach((booking: Booking) => {
                data.eventData?.push({
                    start: toDate(booking.daterange.start),
                    end: toDate(booking.daterange.end),
                    ...booking,
                    type: 'booking',
                });
            });

            formattedData.push(data);
        });

        return formattedData;
    };

    return (<Page size="lg">
        <PageContent>
            <Filters
                className={'mb-2 bg-sidebar p-2 rounded-md'}
                onFiltersChange={setSelectedFilters}
                availableFilters={availableFilters}
                selectedFilters={selectedFilters}
            >
                <Select onValueChange={handleMonthJump}>
                    <SelectTrigger className="max-w-72">
                        <SelectValue placeholder={intl.formatMessage({
                            defaultMessage: 'Jump to',
                            description: 'Placeholder for month selection dropdown'
                        })} />
                    </SelectTrigger>
                    <SelectContent>
                        {monthOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </Filters>
            <div className="flex-1 relative">
                {propertiesLoading && (
                    <div className="space-y-4">
                        {Array.from({length: 5}).map((_, index) => (
                            <div key={index} className="space-y-2">
                                {/* Property header with image and name */}
                                <div className="flex items-center gap-3 mb-2">
                                    <Skeleton className="size-7 rounded"/>
                                    <Skeleton className="h-5 w-48"/>
                                </div>

                                {/* Horizontal calendar skeleton */}
                                <div className="flex gap-1 overflow-hidden">
                                    {Array.from({length: 30}).map((_, dayIndex) => (
                                        <Skeleton
                                            key={dayIndex}
                                            className="min-w-[70px] h-[50px] rounded"
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {!propertiesLoading && properties != undefined &&
                    <Multicalendar
                        dayCellHeight={50}
                        dayCellWidth={70}
                        resourceRowHeight={50}
                        eventRowHeight={40}
                        onLoadMissingData={(resources: Property[], start, end) => loadData(resources, start, end)}
                        /* // @ts-ignore */
                        onDateRangeSelected={(resource: Property, startDate, endDate) => {
                            setSelectedDates({
                                start: formatDate(startDate),
                                end: formatDate(endDate),
                            });
                            setSelectedProperty(resource);
                        }}
                        pastMonthsToRender={1}
                        futureMonthsToRender={24}
                        // @ts-ignore
                        renderDayElement={DayElement}
                        // @ts-ignore
                        renderResourceElement={ResourceElement}
                        // @ts-ignore
                        renderDayHeaderElement={DayHeaderElement}
                        // @ts-ignore
                        renderEventElement={EventElement}
                        resources={properties}
                    />
                }
            </div>

                <CalendarSelectionSheet property={selectedProperty} daterange={selectedDates} onClose={() => {
                    setSelectedProperty(null);
                    setSelectedDates(null);
                }} />

        </PageContent>
    </Page>);
}