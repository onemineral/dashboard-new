import { FilterSelection } from "@/components/application/filters/filters";
import { useFiltersRequest } from "@/components/application/filters/hooks/use-filters-request";
import { SortDefinition } from "@/components/application/data/sort-dropdown.tsx";
import { mergeObjects } from "@/lib/utils";
import { useEffect, useState } from "react";

export function useDataTable({initialFilters = [], currentPage = 1, perPage = 30, initialSort = null}: {initialFilters?: FilterSelection[], currentPage?: number, perPage?: number, initialSort?: SortDefinition|null}) {
    const {selectedFilters, setSelectedFilters, body} = useFiltersRequest(initialFilters);
    const [page, setPage] = useState(currentPage);
    const [sort, setSort] = useState<SortDefinition|null|undefined>(initialSort);

    useEffect(() => {
        setPage(1);
    }, [body]);

    return {
        selectedFilters, 
        setSelectedFilters, 
        body: mergeObjects(mergeObjects({paginate: {perpage: perPage, page}}, body), {sort: [sort].filter((f) => f)}), 
        page, 
        setPage, 
        perPage,
        setSort,
        sort,
    };
}