import Multicalendar, {
    MulticalendarDayElementProp,
    MulticalendarEventElementProp,
    RenderDayHeader
} from "@/components/application/calendar/multi";
import {
    Pagination,
    PaginationContent, PaginationEllipsis,
    PaginationItem,
    PaginationLink, PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination.tsx";
import {cn, translated} from "@/lib/utils.ts";
import {toDate} from "date-fns";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import React from "react";
import {Booking, Property, RatesAvailability} from "@onemineral/pms-js-sdk";
import {useQuery} from "@tanstack/react-query";
import api from "@/lib/api.ts";
import {CalendarDate, CalendarResourceDayData} from "@/components/application/calendar/types.ts";
import {Page, PageContent, PageHeader, PageTitle} from "@/components/application/page";
import Link from "@/components/application/link";
import { useModalNavigate } from "@/hooks/use-modal-navigate";

const EventElement = (props: MulticalendarEventElementProp) => {
    const {event, resource, className, ...divProps} = props;

    return <div className={cn(className, 'p-1 overflow-hidden')} {...divProps}>
        <Link modal to={`/calendar/${resource.id}`}>
            <div
                className={'px-1 border-sky-950 w-full rounded h-full bg-sky-700 flex items-center text-xs text-white'}>
                <div className={'sticky left-0 flex items-center text-ellipsis whitespace-nowrap max-w-full gap-1'}>
                    {event.channel?.icon_url ? <>
                        <img src={event.channel?.icon_url} alt={''} className={'size-5 rounded'}/>
                    </> : null}
                    {event.main_guest?.full_name}<br/>
                    {event.daterange.start} {'->'} {event.daterange.end}
                </div>
            </div>
        </Link>
    </div>;
}

const DayElementRate = ({rate, prevRate, resource}: {
    rate: RatesAvailability | undefined,
    prevRate: RatesAvailability | undefined,
    resource: Property
}) => {
    return <>
        {rate ? (
            <>
                {rate.rate ?
                    <div className={'text-xs mb-[18px]'}>
                        {rate.rate?.toLocaleString(undefined, {
                            style: 'currency',
                            currency: resource.currency?.iso_code,
                            currencyDisplay: 'narrowSymbol',
                            minimumFractionDigits: 0,
                        })}
                    </div> : <div className={'rate-not-defined w-full h-full'}></div>}


                <div className={'bottom-0 absolute w-full flex'}>
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
        className={cn('border cursor-default rounded hover:border-foreground flex items-end justify-center text-sm', props.className, {
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
    const {resource} = props;

    return <Link modal to={`/calendar/${resource.id}`}
    >
        <div className={'flex items-center w-fit text-sm font-bold'}>
            {resource.main_image ?
                <img src={resource.main_image.thumbnail} alt={''} className={'size-7 rounded mr-3'}/>
                : null}
            {translated(resource.name)}
        </div>
    </Link>;
};

export default function Home() {
    const navigate = useModalNavigate();

    const {isLoading: propertiesLoading, data: properties} = useQuery({
        queryKey: ['multicalendar-properties'],
        queryFn: async () => {
            const response = await api.property.query({
                // @ts-ignore
                no_auto_relations: true,
                paginate: {
                    perpage: 50,
                },
                with: ['main_image', 'currency'],
            })

            return response.response.data;
        }
    });

    const loadData = async (resources: Property[], start: string, end: string): Promise<CalendarResourceDayData[]> => {
        // load the data
        const response = await api.property.query({
            // @ts-ignore
            no_auto_relations: true,
            with_rates_and_bookings: {daterange: {start, end}},
            paginate: {
                perpage: 50,
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
                });
            });

            formattedData.push(data);
        });

        return formattedData;
    };

    return (<Page size="lg">
        <PageHeader>
            <PageTitle>Calendar</PageTitle>
        </PageHeader>
        <PageContent className={'flex flex-col grow pt-1'}>
            <div className="grow">
                {propertiesLoading && <Skeleton/>}
                {!propertiesLoading && properties != undefined &&
                    <Multicalendar
                        dayCellHeight={50}
                        dayCellWidth={70}
                        resourceRowHeight={50}
                        eventRowHeight={50}
                        onLoadMissingData={(resources: Property[], start, end) => loadData(resources, start, end)}
                        /* // @ts-ignore */
                        onDateRangeSelected={(resource: Property) => {
                            navigate(`/calendar-update/${resource.id}`);
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

            <Pagination className={'py-2'}>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious href="#"/>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink href="#">1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink href="#" isActive>
                            2
                        </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink href="#">3</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationEllipsis/>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext href="#"/>
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </PageContent>
    </Page>);
}