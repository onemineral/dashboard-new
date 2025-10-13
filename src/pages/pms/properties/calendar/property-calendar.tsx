import {useParams} from 'react-router-dom'
import {cn, YMD_FORMAT} from "@/lib/utils.ts";
import {addMonths, endOfMonth, format, startOfMonth, subMonths, toDate} from "date-fns";
import {useState} from "react";
import {Booking, Property, RatesAvailability} from "@onemineral/pms-js-sdk";
import {useQuery} from "@tanstack/react-query";
import api from "@/lib/api.ts";
import {CalendarDate, CalendarDayInfo, CalendarEventInfo} from "@/components/application/calendar/types.ts";
import SingleCalendar, {SingleCalendarDayElementProp} from "@/components/application/calendar/single";
import {Page, PageBreadcrumbs, PageContent, PageDescription, PageHeader, PageTitle} from "@/components/application/page";
import {CircleAlert} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import FixedFormActions from "@/components/application/fixed-form-actions";

export default function PropertyCalendar() {
    const {id} = useParams();
    const [dates] = useState<Date[]>([
        startOfMonth(subMonths(new Date(), 1)),
        endOfMonth(addMonths(new Date(), 24))
    ]);

    const [property, setProperty] = useState<Property | null>(null);
    const [eventsData, setEventsData] = useState<CalendarEventInfo[]>([]);
    const [daysData, setDaysData] = useState<CalendarDayInfo[]>([]);

    const DayElement = (props: SingleCalendarDayElementProp) => {
        const {date, dayInfo, prevDayInfo, isSelected, ...divProps}: {
            date: CalendarDate,
            dayInfo: RatesAvailability,
            prevDayInfo?: RatesAvailability,
            isSelected: boolean,
        } & any = props;

        return <div
            {...divProps}
            draggable={props.draggable && !date.isPast}
            className={cn('border mt-1 relative min-h-14 cursor-default rounded hover:border-foreground flex items-end justify-center text-sm', props.className, {
                'opacity-50': date.isPast,
                'bg-sky-300/10': date.isWeekend,
                'border-foreground': isSelected,
                'bg-sky-300/20': date.isToday,
            })}>
            {dayInfo.rate ?
                <div className={'text-xs mb-[18px]'}>
                    {dayInfo.rate?.toLocaleString(undefined, {
                        style: 'currency',
                        currency: property?.currency?.iso_code || 'USD',
                        currencyDisplay: 'narrowSymbol',
                        minimumFractionDigits: 0,
                    })}
                </div> : <div className={'rate-not-defined w-full h-full'}></div>}


            <div className={'bottom-0 absolute w-full flex'}>
                <div className={'w-1/3 h-1'}
                     style={prevDayInfo ? {background: prevDayInfo?.availability_status?.calendar_color} : {}}></div>
                <div className={'w-2/3 h-1'}
                     style={{background: dayInfo.availability_status?.calendar_color}}></div>
            </div>
        </div>;
    };

    const {isLoading} = useQuery({
        queryKey: ['property'],
        queryFn: async () => {
            const response = await api.property.query({
                // @ts-ignore
                no_auto_relations: true,
                with_rates_and_bookings: {
                    daterange: {
                        start: format(dates[0], YMD_FORMAT),
                        end: format(dates[1], YMD_FORMAT),
                    }
                },
                where: {
                    conditions: [{
                        field: 'id',
                        in: [id],
                    }]
                }
            });

            if (!response.response.data.length) {
                return;
            }
            const result = response.response.data[0];

            setProperty(result);

            // key rates availability by day
            const eventData: CalendarEventInfo[] = [];
            const dayData: CalendarDayInfo[] = [];

            result.rates_availability?.forEach((rate: RatesAvailability) => {
                dayData.push({
                    date: rate.day,
                    ...rate,
                });
            });

            result.bookings?.forEach((booking: Booking) => {
                eventData?.push({
                    start: toDate(booking.daterange.start),
                    end: toDate(booking.daterange.end),
                    ...booking,
                });
            });

            setDaysData(dayData);
            setEventsData(eventData);

            return true;
        },
    });

    return (<Page size={'sm'}>
        <PageBreadcrumbs breadcrumbs={[
            {label: 'Home', href: '/'},
            {label: 'Dashboard', href: '/demo'},
            {label: 'Page'}
        ]}/>
        <PageHeader className={'pb-0'}>
            <PageTitle>Property calendar</PageTitle>
            <PageDescription>
                Welcome to the calendar page
            </PageDescription>
        </PageHeader>
        <PageContent className={'overflow-y-auto pt-0'}>
            {isLoading && <div>Loading...</div>}
            {!isLoading && property !== null && (<>
                <SingleCalendar
                    // @ts-ignore
                    renderDayElement={DayElement}
                    eventsData={eventsData}
                    daysData={daysData}
                    startDate={dates[0]}
                    endDate={dates[1]}
                />
            </>)}

            <FixedFormActions visible={true}>
                <CircleAlert className={'text-orange-300 size-5 ml-1'}/>
                <div className={'mr-10 text-muted-foreground font-semibold'}>
                    Unsaved changes
                </div>
                <Button variant={"outline"} className={''} size={'sm'}>Reset</Button>
                <Button variant={'default'} size={'sm'}>Save</Button>
            </FixedFormActions>
        </PageContent>
    </Page>);
}