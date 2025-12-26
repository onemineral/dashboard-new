import {Property} from "@sdk/generated";
import {Sheet, SheetContent, SheetHeader, SheetTitle} from "@/components/ui/sheet.tsx";
import {FormattedMessage} from "react-intl";
import {useTranslate} from "@/hooks/use-translate.ts";
import {Button} from "@/components/ui/button.tsx";
import {useEffect, useState} from "react";
import ResourceInput from "@/components/application/inputs/resource-input.tsx";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import UpdateAvailabilityForm from "@/pages/pms/properties/components/update-availability-form.tsx";
import UpdateRatesForm from "@/pages/pms/properties/components/update-rates-form.tsx";
import AvailabilityHistory from "@/pages/pms/properties/components/availability-history.tsx";

export default function CalendarSelectionSheet({property, daterange, onClose}: {
    onClose: () => void;
    property: Property | null;
    daterange: { start: string; end: string } | null
}) {
    const translate = useTranslate();
    const [selectedAction, setSelectedAction] = useState<'availability' | 'rates' | 'history' | null>(null);
    const [internalDaterange, setInternalDaterange] = useState(daterange);

    useEffect(() => {
        setInternalDaterange(daterange);
    }, [daterange]);

    const handleClose = () => {
        onClose();
        setSelectedAction(null);
    }

    return <Sheet open={!!property} onOpenChange={handleClose}>
        <SheetContent className={'md:max-w-md! px-0!'} onEscapeKeyDown={(e) => {
            e.preventDefault()
        }}>
            <SheetHeader className={'px-4'}>
                <SheetTitle className={'flex items-center gap-2'}>
                    <Avatar className={'rounded-md'}>
                        <AvatarImage src={property?.main_image?.thumbnail}></AvatarImage>
                        <AvatarFallback>IM</AvatarFallback>
                    </Avatar>
                    {translate(property?.name)}
                </SheetTitle>
            </SheetHeader>

            {property && daterange && (<>
                <div className="flex flex-col gap-6 px-4">
                    <ResourceInput
                        resource={'property'}
                        field={'daterange'}
                        label={''}
                        action={'set-rates-availability'}
                        value={internalDaterange}
                        onChange={setInternalDaterange}
                        options={{currency: property.currency}}
                    />
                </div>


                {selectedAction === null && (
                    <div className="flex flex-col items-center gap-6 px-4 py-8">
                        {/* Illustration */}
                        <img
                            src="/illustrations/grow.svg"
                            alt=""
                            className="w-80"
                        />
                        
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

                {selectedAction === 'availability' && <UpdateAvailabilityForm onClose={handleClose} onBack={() => setSelectedAction(null)} property={property} daterange={internalDaterange} />}
                {selectedAction === 'rates' && <UpdateRatesForm onClose={handleClose} onBack={() => setSelectedAction(null)} property={property} daterange={internalDaterange} />}
                {selectedAction === 'history' && <AvailabilityHistory property={property} daterange={internalDaterange} onBack={() => setSelectedAction(null)} />}
            </>)}
        </SheetContent>
    </Sheet>;
}