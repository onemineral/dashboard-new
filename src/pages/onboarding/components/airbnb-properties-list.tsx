import {FormattedMessage} from "react-intl";
import {Building2, Info} from "lucide-react";
import {Airbnb} from "@sdk/generated";
import {useQuery, useMutation} from "@tanstack/react-query";
import api from "@/lib/api";
import {Checkbox} from "@/components/ui/checkbox";
import {cn} from "@/lib/utils";
import {Skeleton} from "@/components/ui/skeleton";
import {Button} from "@/components/ui/button";
import {useForm, Controller} from "react-hook-form";
import {Badge} from "@/components/ui/badge";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {RadioGroup} from "@/components/ui/radio-group";
import {useState, useEffect} from "react";
import {AirbnbCommissionExplain} from "@/pages/onboarding/components/airbnb-commission-explain.tsx";
import {RadioCard} from "@/components/application/inputs/radio-card-group";

interface AirbnbListing {
    id: string;
    name: string;
    status: string;
    approval_status: string | null;
    synchronization_category: string;
    tier: string;
    city: string;
    state: string;
    is_primary_host: boolean;
}

interface AirbnbPropertiesListProps {
    channel: Airbnb;
    onSelectionChange?: (selectedIds: string[]) => void;
    onSave: () => void;
}

interface FormData {
    properties: Record<string, boolean>;
    commissionStructure: "split-fee" | "host-only" | "";
}

export default function AirbnbPropertiesList({
                                                 channel,
                                                 onSave
                                             }: AirbnbPropertiesListProps) {
    const [detectedFeeType, setDetectedFeeType] = useState<"host-only" | "split-fee" | null>(null);
    const [commissionError, setCommissionError] = useState<string | null>(null);

    const {control, watch, setValue} = useForm<FormData>({
        defaultValues: {
            properties: {},
            commissionStructure: ""
        }
    });

    const selectedProperties = watch("properties");
    const commissionStructure = watch("commissionStructure");

    // Set commission structure based on detected fee type
    useEffect(() => {
        if (detectedFeeType === "host-only") {
            setValue("commissionStructure", "host-only");
        } else if (detectedFeeType === "split-fee") {
            setValue("commissionStructure", "split-fee");
        } else if (detectedFeeType === null) {
            // Don't select anything by default when null
            setValue("commissionStructure", "");
        }
    }, [detectedFeeType, setValue]);
    const {data: properties, isLoading} = useQuery({
        queryKey: ["airbnb.getAllListings", channel.id],
        queryFn: async () => {
            const allListings: AirbnbListing[] = [];
            let cursor: string | null = null;

            do {
                const response = await api.airbnb.getAllListings({
                    channel: channel.id,
                    cursor: cursor || undefined,
                    detect_fee_structure: !cursor,
                });

                const data = response.response?.data;
                if (data?.listings) {
                    allListings.push(...data.listings);

                    if (!cursor && data.fee_type) {
                        // Detect and store the fee type from the first response
                        setDetectedFeeType(data.fee_type as "host-only" | "split-fee");
                    }
                }

                cursor = data?.cursor || null;
            } while (cursor);

            // Initialize form with all properties selected
            const initialSelection: Record<string, boolean> = {};
            allListings.forEach(listing => {
                initialSelection[listing.id] = true;
            });
            setValue("properties", initialSelection);

            return allListings;
        },
    });

    // Get selected property IDs for mutation
    const getSelectedPropertyIds = () => {
        return Object.entries(selectedProperties)
            .filter(([_, isSelected]) => isSelected)
            .map(([id]) => id);
    };

    // Mutation to save selected properties
    const savePropertiesMutation = useMutation({
        mutationFn: async () => {
            const selectedIds = getSelectedPropertyIds();

            await api.airbnb.importMultiple({
                channel: channel.id,
                listing_ids: selectedIds,
                markup: commissionStructure == 'split-fee' ? 15 : null,
            });
        },
        onSuccess: () => {
            onSave();
        },
        onError: (error) => {
            console.error('Failed to save properties:', error);
        },
    });

    const handleContinue = () => {
        // Validate commission structure is selected when it needs to be
        if (detectedFeeType !== "host-only" && !commissionStructure) {
            setCommissionError("Please select a commission structure");
            return;
        }
        setCommissionError(null);
        savePropertiesMutation.mutate();
    };

    const selectedCount = getSelectedPropertyIds().length;

    // Check if there are any co-hosted properties
    const hasCoHostedProperties = properties?.some(property => !property.is_primary_host) || false;

    return (
        <div className="w-full space-y-6">
            {/* Commission Structure Section - Conditional Rendering */}
            {!isLoading && (
                <>
                    {detectedFeeType !== "host-only" && (
                        // Fee type unknown - Ask the user
                        <div className="space-y-3">
                            <div className="space-y-2">
                                <h3 className="text-sm font-semibold">
                                    <FormattedMessage
                                        defaultMessage="Airbnb Commission Structure"
                                        description="Commission structure section title"
                                    />
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    <FormattedMessage
                                        defaultMessage="Select your Airbnb fee structure to sync rates correctly."
                                        description="Commission structure section description"
                                    />
                                </p>
                            </div>

                            {commissionError && (
                                <Alert variant="destructive">
                                    <AlertDescription>{commissionError}</AlertDescription>
                                </Alert>
                            )}

                            <Controller
                                name="commissionStructure"
                                control={control}
                                render={({field}) => (
                                    <RadioGroup value={field.value} onValueChange={(value) => {
                                        field.onChange(value);
                                        setCommissionError(null);
                                    }}>
                                        <div className="grid grid-cols-1 gap-3">
                                            {/* Split-Fee Option */}
                                            <RadioCard
                                                value="split-fee"
                                                isSelected={field.value === "split-fee"}
                                                onSelect={() => {
                                                    field.onChange("split-fee");
                                                    setCommissionError(null);
                                                }}
                                                title={
                                                    <div className="flex items-center justify-between gap-2 flex-wrap flex-1">
                                                        <span className="font-semibold">
                                                            <FormattedMessage
                                                                defaultMessage="Split-Fee"
                                                                description="Split fee option title"
                                                            />
                                                        </span>
                                                        <div className="flex items-center gap-1.5">
                                                            <Badge variant="secondary" className="font-normal text-xs">
                                                                <FormattedMessage
                                                                    defaultMessage="Host: ~3%"
                                                                    description="Split fee host rate badge"
                                                                />
                                                            </Badge>
                                                            <Badge variant="secondary" className="font-normal text-xs">
                                                                <FormattedMessage
                                                                    defaultMessage="Guest: 14.1 - 16.5%"
                                                                    description="Split fee guest rate badge"
                                                                />
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                }
                                            >
                                                <p className="text-xs text-muted-foreground">
                                                    <FormattedMessage
                                                        defaultMessage="We'll apply automatic markup to maintain your earnings when syncing with our PMS. <link>How it works →</link>"
                                                        description="Split fee markup note with link to explanation"
                                                        values={{
                                                            link: (chunks) => (
                                                                <AirbnbCommissionExplain>
                                                                    {chunks}
                                                                </AirbnbCommissionExplain>
                                                            )
                                                        }}
                                                    />
                                                </p>
                                            </RadioCard>

                                            {/* Host-Only Option */}
                                            <RadioCard
                                                value="host-only"
                                                isSelected={field.value === "host-only"}
                                                onSelect={() => {
                                                    field.onChange("host-only");
                                                    setCommissionError(null);
                                                }}
                                                title={
                                                    <div className="flex items-center justify-between gap-2 flex-wrap flex-1">
                                                        <span className="font-semibold">
                                                            <FormattedMessage
                                                                defaultMessage="Host-Only Fee"
                                                                description="Host-only fee option title"
                                                            />
                                                        </span>
                                                        <div className="flex items-center gap-1.5">
                                                            <Badge variant="secondary" className="font-normal text-xs">
                                                                <FormattedMessage
                                                                    defaultMessage="Host: 15.5%"
                                                                    description="Host-only fee host rate badge"
                                                                />
                                                            </Badge>
                                                            <Badge variant="secondary" className="font-normal text-xs">
                                                                <FormattedMessage
                                                                    defaultMessage="Guest: 0%"
                                                                    description="Host-only fee guest rate badge"
                                                                />
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                }
                                            >
                                                <p className="text-xs text-muted-foreground">
                                                    <FormattedMessage
                                                        defaultMessage="Your rates will sync as-is. Already optimized for PMS use."
                                                        description="Host-only fee note"
                                                    />
                                                </p>
                                            </RadioCard>
                                        </div>
                                    </RadioGroup>
                                )}
                            />
                        </div>
                    )}
                </>
            )}

            <h3 className="text-sm font-semibold">
                <FormattedMessage
                    defaultMessage="Import airbnb listings"
                    description="Import listings from airbnb title"
                />
            </h3>

            {/* Co-hosted Properties Alert */}
            {hasCoHostedProperties && (
                <Alert>
                    <Info className="size-4"/>
                    <AlertDescription>
                        <FormattedMessage
                            defaultMessage="Some properties are marked as co-hosted, meaning you're not the primary host. These properties will be imported to your dashboard, but any changes made here won't sync back to Airbnb to avoid conflicts with the primary host's settings."
                            description="Co-hosted properties information alert"
                        />
                    </AlertDescription>
                </Alert>
            )}

            {/* Properties List */}
            <div className="space-y-4">
                {/* Properties Grid */}
                <div className="grid grid-cols-1 gap-3 overflow-y-auto pr-1">
                    {isLoading ? (
                        // Loading skeleton
                        [1, 2, 3].map((index) => (
                            <div
                                key={index}
                                className="group relative rounded-xl border border-border bg-card"
                            >
                                <div className="flex items-center gap-2 py-1 px-3">
                                    {/* Checkbox Skeleton */}
                                    <div className="shrink-0 pt-0.5">
                                        <Skeleton className="size-4 rounded"/>
                                    </div>

                                    {/* Property Icon Skeleton */}
                                    <div className="shrink-0">
                                        <Skeleton className="size-12 rounded-xl"/>
                                    </div>

                                    {/* Property Details Skeleton */}
                                    <div className="flex-1 min-w-0 space-y-2">
                                        <Skeleton className="h-5 w-3/4"/>
                                        <Skeleton className="h-3 w-1/2"/>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        properties?.map((property) => (
                            <Controller
                                key={property.id}
                                name={`properties.${property.id}`}
                                control={control}
                                render={({field}) => {
                                    const isSelected = field.value;

                                    return (
                                        <div
                                            className={cn(
                                                "group relative rounded-xl border transition-all duration-200 cursor-pointer",
                                                isSelected
                                                    ? "border-primary"
                                                    : "border-border bg-card hover:border-primary/30"
                                            )}
                                            onClick={() => field.onChange(!field.value)}
                                        >
                                            <div className="flex items-center gap-2 py-1 px-3">
                                                {/* Checkbox */}
                                                <div className="shrink-0 pt-0.5">
                                                    <Checkbox
                                                        checked={isSelected}
                                                        onCheckedChange={field.onChange}
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="size-4"
                                                    />
                                                </div>

                                                {/* Property Icon */}
                                                <div className="shrink-0">
                                                    <div className={cn(
                                                        "size-12 rounded-xl flex items-center justify-center transition-colors",
                                                        "bg-accent"
                                                    )}>
                                                        <Building2 className={cn(
                                                            "size-6 transition-colors",
                                                            isSelected
                                                                ? "text-primary"
                                                                : "text-primary/70 group-hover:text-primary"
                                                        )}/>
                                                    </div>
                                                </div>

                                                {/* Property Details */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2 mb-1">
                                                        <h4 className="font-semibold line-clamp-2">
                                                            {property.name}
                                                        </h4>
                                                        <Badge
                                                            variant={property.is_primary_host ? "secondary" : "destructive"}
                                                            className="shrink-0"
                                                        >
                                                            {property.is_primary_host ? (
                                                                <FormattedMessage
                                                                    defaultMessage="Primary Host"
                                                                    description="Primary host badge label for airbnb property."
                                                                />
                                                            ) : (
                                                                <FormattedMessage
                                                                    defaultMessage="Co-Host"
                                                                    description="Secondary host badge label for airbnb property"
                                                                />
                                                            )}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">
                                                        {property.city && property.state && `${property.city}, ${property.state} • `}
                                                        {property.id}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-2 pt-4">
                <Button
                    variant="ghost"
                    className="flex-1"
                    onClick={onSave}
                    disabled={savePropertiesMutation.isPending}
                >
                    <FormattedMessage
                        defaultMessage="Skip for now"
                        description="Skip button label"
                    />
                </Button>

                <Button
                    className="flex-1"
                    onClick={handleContinue}
                    disabled={savePropertiesMutation.isPending || selectedCount === 0}
                >
                    <FormattedMessage
                        defaultMessage="Continue"
                        description="Continue button label"
                    />
                </Button>
            </div>
        </div>
    );
}