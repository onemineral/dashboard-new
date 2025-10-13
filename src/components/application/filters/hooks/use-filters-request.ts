import {FilterSelection} from "@/components/application/filters/filters";
import {useEffect, useState} from "react";
import deepEqual from "deep-equal";
import {mergeObjects} from "@/lib/utils.ts";

/**
 * Merges all variables into a single object. identical keys with non array values will be replaced, array values will be merged
 *
 * @param args (object|null|undefined)[]
 */
export function mergeRequestBody(...args: (object|null|undefined)[]): object | null {
    let result: any = {};

    if(!args.length) {
        return null;
    }

    args.forEach((body) => {
        result = mergeObjects(result, body);
    });

    return result;
}

const extractBodyFromFilters = (filters: FilterSelection[]) => {
    if(filters.length == 0) return {};

    const bodies = filters?.filter((filter) => !!filter.body).map((filter) => filter.body);

    if(bodies.length == 0) return {};

    return mergeRequestBody(...bodies);
}

export function useFiltersRequest(filters: FilterSelection[]) {
    const [selectedFilters, setSelectedFilters] = useState<FilterSelection[]>(filters);
    const [body, setBody] = useState<any>();

    useEffect(() => {
        const newBody = extractBodyFromFilters(selectedFilters);

        if(!deepEqual(newBody, body)) {
            setBody({...newBody});
        }
    }, [body, selectedFilters])

    return {
        body,
        selectedFilters,
        setSelectedFilters,
    }
}