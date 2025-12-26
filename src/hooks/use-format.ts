import {useContext} from "react";
import {AppContext} from "@/contexts/app-context.tsx";
import {format, parseISO} from "date-fns";

export function useDateFormat() {
    const {profile} = useContext(AppContext);

    const dateFormat = profile?.settings?.date_format
            ?.replace('YYYY', 'yyyy')
            ?.replace('DD', 'dd')
        ?? 'yyyy-MM-dd';

    return (date: string|Date) => {
        // If date is a string, parse it first (handles both ISO timestamps and Y-m-d format)
        const dateObj = typeof date === 'string' ? parseISO(date) : date;
        return format(dateObj, dateFormat);
    }
}