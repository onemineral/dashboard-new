import {FormattedMessage} from "react-intl";
import {Property} from "@sdk/generated";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import SimpleCalendarUpdateForm from "@/pages/pms/properties/components/rates/simple-calendar-update-form.tsx";
import AdvancedCalendarUpdateForm from "@/pages/pms/properties/components/rates/advanced-calendar-update-form.tsx";
import {useState, useEffect} from "react";

export default function UpdateRatesForm({property, daterange, onClose, onBack}: {
    onBack: () => void;
    onClose: () => void;
    property: Property;
    daterange: { start: string; end: string } | null
}) {
    const [activeTab, setActiveTab] = useState<"simple" | "advanced">("simple");
    const [internalDaterange, setInternalDaterange] = useState(daterange);

    useEffect(() => {
        setInternalDaterange(daterange);
    }, [daterange]);

    return (
        <div className="flex flex-col flex-1 mt-4">
            <div className="space-y-1 px-4 mb-4">
                <h3 className="font-medium text-center text-foreground">
                    <FormattedMessage
                        defaultMessage="Update rates & restrictions"
                        description="Title for updating rates and restrictions"
                    />
                </h3>
            </div>

            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "simple" | "advanced")} className="flex-1 flex flex-col px-4">
                <TabsList className="w-full">
                    <TabsTrigger value="simple" className="flex-1">
                        <FormattedMessage
                            defaultMessage="Simple"
                            description="Tab label for simple rates update mode"
                        />
                    </TabsTrigger>
                    <TabsTrigger value="advanced" className="flex-1">
                        <FormattedMessage
                            defaultMessage="Advanced"
                            description="Tab label for advanced rates update mode with day-specific settings"
                        />
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="simple" className="flex-1 flex flex-col mt-0">
                    <SimpleCalendarUpdateForm
                        property={property}
                        onBack={onBack}
                        daterange={internalDaterange}
                        onClose={onClose}
                    />
                </TabsContent>

                <TabsContent value="advanced" className="flex-1 flex flex-col mt-0">
                    <AdvancedCalendarUpdateForm
                        onBack={onBack}
                        property={property}
                        daterange={internalDaterange}
                        onClose={onClose}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}