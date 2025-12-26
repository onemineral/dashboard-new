import { FormattedMessage } from "react-intl";
import {AvailabilityStatus, Property} from "@sdk/generated";
import { Availability } from "@sdk/generated/availability";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import { Calendar, FileText, User, Link2, ShoppingCart, HelpCircle } from "lucide-react";
import { format } from "date-fns";
import api from "@/lib/api.ts";
import { type ReactNode, useMemo } from "react";
import {DateRange} from "@/components/application/display/daterange.tsx";

/**
 * AvailabilityHistory Component
 * 
 * Displays a chronological history of availability changes for a property's date range.
 * Shows who made changes, when they were made, and what was changed.
 * 
 * Props:
 * - property: Property - The property to show history for
 * - daterange: { start: string; end: string } - The date range to filter history
 * - onBack: () => void - Callback to go back to previous screen
 * 
 * Features:
 * - Timeline view of changes
 * - User avatars and names
 * - Date formatting using useDateFormat hook
 * - Status badges with colors
 * - Notes display
 * - Empty state when no history
 * - Loading and error states
 * 
 * Example:
 * ```tsx
 * <AvailabilityHistory
 *   property={property}
 *   daterange={{ start: '2024-01-01', end: '2024-01-31' }}
 *   onBack={() => setView('actions')}
 * />
 * ```
 */

interface AvailabilityHistoryProps {
    property: Property;
    daterange: { start: string; end: string } | null;
    onBack: () => void;
}

/**
 * BaseTimelineItemContent Component
 *
 * Abstract component for rendering timeline item content with consistent structure.
 * Displays icon, timestamp, sentence, daterange, and availability status as a colored border.
 */
interface BaseTimelineItemContentProps {
    createdAt: string | null;
    sentence: ReactNode;
    daterange?: { start: string; end: string } | null;
    availabilityStatus?: AvailabilityStatus;
    notes?: string | null;
}

function BaseTimelineItemContent({
    createdAt,
    sentence,
    daterange,
    availabilityStatus,
    notes
}: BaseTimelineItemContentProps) {
    return (
        <div
            className="flex-1 pb-4 border-r-4 pr-4 space-y-1"
            style={{
                borderColor: availabilityStatus?.calendar_color || 'transparent'
            }}
        >
            <div className="flex items-center gap-1.5">
                {createdAt ? format(new Date(createdAt), 'MMM d, yyyy HH:mm') : ''}
            </div>

            {/* Sentence and timestamp */}
                <p className="text-sm text-foreground leading-relaxed mb-1">
                    {sentence}
                </p>

            <DateRange value={daterange || null} />

            {/* Notes */}
            {notes && (
                <div className="flex gap-1.5 text-sm mt-2">
                    <FileText className="size-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        {notes}
                    </p>
                </div>
            )}
        </div>
    );
}

/**
 * UserTimelineItemContent Component
 *
 * Timeline item for availability changes made by a user.
 */
function UserTimelineItemContent({ item }: { item: Availability }) {
    const sentence = (
        <FormattedMessage
            defaultMessage="{userName} updated the availability status to {status}"
            description="Sentence describing a user changing availability status"
            values={{
                userName: <strong>{item.created_by?.name}</strong>,
                status: <strong>{item.availability_status?.name}</strong>,
            }}
        />
    );

    return (
        <BaseTimelineItemContent
            createdAt={item.created_at}
            sentence={sentence}
            daterange={item.daterange}
            availabilityStatus={item.availability_status}
            notes={item.notes}
        />
    );
}

/**
 * ICalTimelineItemContent Component
 *
 * Timeline item for availability changes imported from iCal.
 */
function ICalTimelineItemContent({ item }: { item: Availability }) {
    const sentence = (
        <FormattedMessage
            defaultMessage="iCal import from {icalName} updated the availability status to {status}"
            description="Sentence describing an iCal import changing availability status"
            values={{
                icalName: <strong>{item.property_ical?.name}</strong>,
                status: <strong>{item.availability_status?.name}</strong>,
            }}
        />
    );

    return (
        <BaseTimelineItemContent
            createdAt={item.created_at}
            sentence={sentence}
            daterange={item.daterange}
            availabilityStatus={item.availability_status}
            notes={item.notes}
        />
    );
}

/**
 * BookingTimelineItemContent Component
 *
 * Timeline item for availability changes created by a booking.
 */
function BookingTimelineItemContent({ item }: { item: Availability }) {
    const sentence = (
        <FormattedMessage
            defaultMessage="Booking {bookingId} created availability with status {status}"
            description="Sentence describing a booking creating availability"
            values={{
                bookingId: <strong>#{item.booking?.id}</strong>,
                status: <strong>{item.availability_status?.name}</strong>,
            }}
        />
    );

    return (
        <BaseTimelineItemContent
            createdAt={item.created_at}
            sentence={sentence}
            daterange={item.daterange}
            availabilityStatus={item.availability_status}
            notes={item.notes}
        />
    );
}

/**
 * UnknownTimelineItemContent Component
 *
 * Timeline item for availability changes from unknown sources.
 */
function UnknownTimelineItemContent({ item }: { item: Availability }) {
    const sentence = (
        <FormattedMessage
            defaultMessage="Availability status was updated to {status}"
            description="Sentence describing an unknown source changing availability status"
            values={{
                status: <strong>{item.availability_status?.name}</strong>,
            }}
        />
    );

    return (
        <BaseTimelineItemContent
            createdAt={item.created_at}
            sentence={sentence}
            daterange={item.daterange}
            availabilityStatus={item.availability_status}
            notes={item.notes}
        />
    );
}

/**
 * TimelineItem Component
 *
 * Renders a single timeline entry for an availability change.
 * Uses specialized content components based on the source type.
 */
function TimelineItem({
    item,
    isLast,
}: {
    item: Availability;
    isLast: boolean;
}) {
    const { SourceIcon, ContentComponent } = useMemo(() => {
        if (item.created_by) {
            return { SourceIcon: User, ContentComponent: UserTimelineItemContent };
        }
        if (item.property_ical) {
            return { SourceIcon: Link2, ContentComponent: ICalTimelineItemContent };
        }
        if (item.booking) {
            return { SourceIcon: ShoppingCart, ContentComponent: BookingTimelineItemContent };
        }
        return { SourceIcon: HelpCircle, ContentComponent: UnknownTimelineItemContent };
    }, [item.created_by, item.property_ical, item.booking]);

    return (
            <div className="flex gap-3 px-4">
                {/* Timeline dot and line */}
                <div className="flex flex-col items-center">
                    <Avatar className="size-8">
                        <AvatarFallback className="text-xs">
                            <SourceIcon className="size-4" />
                        </AvatarFallback>
                    </Avatar>
                    {!isLast && (
                        <div className="w-px bg-border flex-1 my-2" />
                    )}
                </div>

                {/* Content - uses specialized component based on source */}
                <ContentComponent item={item} />
            </div>
    );
}

/**
 * LoadingState Component
 */
function LoadingState() {
    return (
        <div className="flex-1 flex flex-col mt-4 px-4">
            <div className="space-y-1 mb-6">
                <h3 className="font-medium text-foreground">
                    <FormattedMessage
                        defaultMessage="Availability History"
                        description="Title for availability history section"
                    />
                </h3>
                <p className="text-sm text-muted-foreground">
                    <FormattedMessage
                        defaultMessage="Loading history..."
                        description="Loading message for availability history"
                    />
                </p>
            </div>
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
        </div>
    );
}

/**
 * ErrorState Component
 */
function ErrorState({ onBack }: { onBack: () => void }) {
    return (
        <div className="flex-1 flex flex-col mt-4 px-4">
            <div className="space-y-1 mb-6">
                <h3 className="font-medium text-foreground">
                    <FormattedMessage
                        defaultMessage="Availability History"
                        description="Title for availability history section"
                    />
                </h3>
            </div>
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
                <p className="text-sm text-destructive">
                    <FormattedMessage
                        defaultMessage="Failed to load history"
                        description="Error message when history fails to load"
                    />
                </p>
                <Button variant="outline" size="sm" onClick={onBack}>
                    <FormattedMessage
                        defaultMessage="Go Back"
                        description="Button to go back after error"
                    />
                </Button>
            </div>
        </div>
    );
}

/**
 * EmptyState Component
 */
function EmptyState() {
    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <Calendar />
                </EmptyMedia>
                <EmptyTitle>
                    <FormattedMessage
                        defaultMessage="No history found"
                        description="Title when no availability history exists"
                    />
                </EmptyTitle>
                <EmptyDescription>
                    <FormattedMessage
                        defaultMessage="No changes have been made to this date range yet"
                        description="Description when no availability history exists"
                    />
                </EmptyDescription>
            </EmptyHeader>
        </Empty>
    );
}

export default function AvailabilityHistory({ property, daterange, onBack }: AvailabilityHistoryProps) {
    const { data: history, isLoading, error } = useQuery<Availability[]>({
        queryKey: ['availability.history', property.id, daterange],
        queryFn: async () => {
            return (await api.availability.history({
                property: property.id,
                // @ts-ignore
                daterange,
            })).response;
        },
        enabled: !!daterange
    });

    if (isLoading) {
        return <LoadingState />;
    }

    if (error) {
        return <ErrorState onBack={onBack} />;
    }

    return (
        <>
            {/* Header */}
            <div className="space-y-1 my-6 px-4">
                <h3 className="font-medium text-foreground">
                    <FormattedMessage
                        defaultMessage="Availability History"
                        description="Title for availability history section"
                    />
                </h3>
                <p className="text-sm text-muted-foreground">
                    <FormattedMessage
                        defaultMessage="View all changes made to availability for the selected dates"
                        description="Description for availability history section"
                    />
                </p>
            </div>

            {/* Timeline */}
                {!history?.length ? (
                    <EmptyState />
                ) : (
                    <div className="space-y-4 flex-1 overflow-y-auto scrollbar-thin">
                        {history.map((item, index) => (
                            <TimelineItem
                                key={item.id}
                                item={item}
                                isLast={index === history.length - 1}
                            />
                        ))}
                    </div>
                )}

            <div className="flex gap-2 p-4">
                <Button
                    type="button"
                    variant="ghost"
                    className="flex-1"
                    onClick={onBack}
                >
                    <FormattedMessage
                        defaultMessage="Back"
                        description="Button text to go back from history view"
                    />
                </Button>
            </div>
        </>
    );
}