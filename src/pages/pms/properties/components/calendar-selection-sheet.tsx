import {Sheet, SheetContent, SheetHeader, SheetTitle} from "@/components/ui/sheet.tsx";
import {FormattedMessage} from "react-intl";
import {useTranslate} from "@/hooks/use-translate.ts";
import {Button} from "@/components/ui/button.tsx";
import {useState} from "react";
import ResourceInput from "@/components/application/inputs/resource-input.tsx";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import UpdateAvailabilityForm from "@/pages/pms/properties/components/update-availability-form.tsx";
import UpdateRatesForm from "@/pages/pms/properties/components/update-rates-form.tsx";
import AvailabilityHistory from "@/pages/pms/properties/components/availability-history.tsx";
import useMultiCalendarStore from "@/components/application/calendar/multi/store/useMultiCalendarStore.ts";
import {useIsMobile} from "@/hooks/use-mobile.ts";

export default function CalendarSelectionSheet() {
    // @ts-ignore
    const selectedRowIndex: number = useMultiCalendarStore(state => Object.keys(state.resourceDatesSelection)?.[0]);
    const selectedCols = useMultiCalendarStore(state => state.resourceDatesSelection[selectedRowIndex]);
    const dates = useMultiCalendarStore(state => state.dates);
    const daterange = selectedCols ? {
        start: dates[selectedCols.start].formattedDate,
        end: dates[selectedCols.end].formattedDate
    } : null;
    const property = useMultiCalendarStore(state => state.resources[selectedRowIndex]);
    const [selectedAction, setSelectedAction] = useState<'availability' | 'rates' | 'history' | null>(null);
    const clearSelection = useMultiCalendarStore(state => state.clearResourceDateSelection);

    const isMobile = useIsMobile();

    const handleClose = () => {
        setSelectedAction(null);
        if (isMobile) {
            clearSelection();
        }
    }

    if (isMobile) {
        return <Sheet open={!!daterange} onOpenChange={handleClose}>
            <SheetContent>
                <SheetHeader className={'hidden'}>
                    <SheetTitle></SheetTitle>
                </SheetHeader>
                <Content property={property} daterange={daterange} setSelectedAction={setSelectedAction}
                         selectedRowIndex={selectedRowIndex} selectedAction={selectedAction} handleClose={handleClose}
                />
            </SheetContent>
        </Sheet>
    }

    // Show empty state when no dates are selected
    if (!property) {
        return (
            <div className={'border-l max-w-96 w-full -my-2 flex items-center justify-center'}>
                <div className="flex flex-col items-center gap-6 px-4 py-8 max-w-md">
                    {/* Illustration */}
                    <img
                        src="/illustrations/grow.svg"
                        alt=""
                        className="w-64 opacity-90"
                    />

                    {/* Title and Description */}
                    <div className="text-center space-y-2">
                        <h3 className="text-xl font-semibold">
                            <FormattedMessage
                                defaultMessage="Select dates"
                                description="Title shown when no dates are selected in calendar"
                            />
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            <FormattedMessage
                                defaultMessage="Click on any date in the calendar to get started managing rates, availability, and reservations."
                                description="Description prompting user to select dates from the calendar"
                            />
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return <div className={'max-w-96 w-full relative border-l'}>
        <div className={'absolute inset-0 overflow-y-auto scrollbar-thin'}>
            <Content property={property} daterange={daterange} setSelectedAction={setSelectedAction}
                     selectedRowIndex={selectedRowIndex} selectedAction={selectedAction} handleClose={handleClose}/>
        </div>
    </div>;
}

const Content = ({property, daterange, setSelectedAction, selectedRowIndex, selectedAction, handleClose}: any) => {
    const daysStr = useMultiCalendarStore(state => state.dateStringsToIndex);
    const setDaterange = useMultiCalendarStore(state => state.setDateSelection);
    const clearSelection = useMultiCalendarStore(state => state.clearResourceDateSelection);


    const translate = useTranslate();

    if(!property) {
        return <div className={'w-full h-80'}></div>;
    }

    return <>
        <div className={'flex items-center gap-2 px-4 mt-4'}>
            <Avatar className={'rounded-md'}>
                <AvatarImage src={property?.main_image?.thumbnail}></AvatarImage>
                <AvatarFallback>IM</AvatarFallback>
            </Avatar>
            {translate(property?.name)}
        </div>

        <div className="flex flex-col gap-6 px-4 mt-4">
            <ResourceInput
                resource={'property'}
                field={'daterange'}
                label={''}
                action={'set-rates-availability'}
                value={daterange}
                onChange={(selection) => {
                    if (selection) {
                        setDaterange(selectedRowIndex, daysStr[selection.start], daysStr[selection.end]);
                    } else {
                        clearSelection();
                    }
                }}
                options={{currency: property.currency}}
            />
        </div>


        {selectedAction === null && (
            <div className="flex flex-col items-center gap-6 px-4 py-8">

                {/* Title and Description */}
                <div className="text-center space-y-1">
                    <h3 className="text-lg font-semibold">
                        <FormattedMessage
                            defaultMessage="Choose an action"
                            description="Title for the action selection section in the calendar"
                        />
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        <FormattedMessage
                            defaultMessage="How would you like to manage the selected dates?"
                            description="Description prompting user to select an action for the calendar dates"
                        />
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 w-full items-center">
                    <Button
                        variant="default"
                        className="w-full gap-2 max-w-80"
                    >
                        <FormattedMessage
                            defaultMessage="New reservation"
                            description="Button to create a new reservation in the calendar"
                        />
                    </Button>

                    <Button
                        variant="outline"
                        className="w-full max-w-80"
                        onClick={() => setSelectedAction('availability')}
                    >
                        <FormattedMessage
                            defaultMessage="Update availability"
                            description="Button to update availability status (open or close dates) for guests to book."
                        />
                    </Button>

                    <Button
                        variant="outline"
                        className="w-full max-w-80"
                        onClick={() => setSelectedAction('rates')}
                    >
                        <FormattedMessage
                            defaultMessage="Update rates & restrictions"
                            description="Button to update pricing and booking restrictions in the calendar"
                        />
                    </Button>

                    <Button
                        variant="ghost"
                        className="w-full max-w-80 text-blue-500"
                        onClick={() => setSelectedAction('history')}
                    >
                        <FormattedMessage
                            defaultMessage="View history"
                            description="Button to view the availability changes history"
                        />
                    </Button>
                </div>
            </div>
        )}

        {selectedAction === 'availability' &&
            <UpdateAvailabilityForm onClose={handleClose} onBack={() => setSelectedAction(null)}
                                    property={property} daterange={daterange}/>}
        {selectedAction === 'rates' &&
            <UpdateRatesForm onClose={handleClose} onBack={() => setSelectedAction(null)} property={property}
                             daterange={daterange}/>}
        {selectedAction === 'history' && <AvailabilityHistory property={property} daterange={daterange}
                                                              onBack={() => setSelectedAction(null)}/>}
    </>;
}