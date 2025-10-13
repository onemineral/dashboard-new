import {useContext} from "react";
import {FilterContext} from "@/contexts/filter-context.tsx";

export function useFilter() {
    const {settings, removeFilter, addFilter, selection} = useContext(FilterContext);

    const remove = ()=> {
        if(settings.featured) {
            addFilter(null, null);
        } else {
            removeFilter();
        }
    }

    return {
        selection,
        remove,
        set: addFilter,
        settings,
    }
}