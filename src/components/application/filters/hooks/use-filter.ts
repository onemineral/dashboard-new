import {useContext} from "react";
import {FilterContext} from "@/contexts/filter-context.tsx";

export function useFilter() {
    const {settings, removeFilter, addFilter, selection} = useContext(FilterContext);

    const remove = ()=> {
        if(settings.featured) {
            addFilter(undefined, undefined);
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