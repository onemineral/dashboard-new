import {useContext} from "react";
import {AppContext} from "@/contexts/app-context.tsx";
import {format} from "date-fns";

export function useDateFormat() {
    const {profile} = useContext(AppContext);

    const dateFormat = profile?.settings?.date_format
            ?.replace('YYYY', 'yyyy')
            ?.replace('DD', 'dd')
        ?? 'yyyy-MM-dd';

    return (date: string|Date) => {
        return format(date, dateFormat);
    }
}