import {Button} from "@/components/ui/button.tsx";
import {ReactNode, useEffect, useState} from "react";
import {Filter, X} from "lucide-react";
import {cn} from "@/lib/utils.ts";
import deepEqual from 'deep-equal';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {FilterContext} from "@/contexts/filter-context.tsx";
import {useFilter} from "@/components/application/filters/hooks/use-filter";
import {FormattedMessage} from "react-intl";

export type FilterSelection = {
    name: string;
    body?: any | null;
    value?: any | null;
}

export type FilterSettings = {
    name: string;
    label: string | ReactNode;
    component: ReactNode;
    featured?: boolean;
};

export function Filters({className, onFiltersChange, availableFilters, selectedFilters, children}: {
    className?: string;
    onFiltersChange: (filters: FilterSelection[]) => void,
    availableFilters: FilterSettings[],
    selectedFilters: FilterSelection[],
    children?: ReactNode,
}) {
    const [hasFiltersSelected, setHasFiltersSelected] = useState<boolean>(false);

    const addFilter = (name: string, value: any, body: any) => {
        const existingFilterIndex = selectedFilters.findIndex((filter) => filter.name === name);

        if (existingFilterIndex !== -1) {
            selectedFilters[existingFilterIndex].body = body;
            selectedFilters[existingFilterIndex].value = value;
            onFiltersChange([...selectedFilters]);
        } else {
            onFiltersChange([...selectedFilters, {name, body, value}]);
        }
    }

    const removeFilter = (name: string | string[]) => {
        if (typeof name === 'string') {
            name = [name];
        }

        onFiltersChange(selectedFilters.filter((filter) => !name.includes(filter.name)) || []);
    }

    const displayFilters = availableFilters.filter((filter) => filter.featured || selectedFilters.find((f) => f.name === filter.name));
    const additionalFilters = availableFilters.filter((filter) => !(filter.featured || selectedFilters.find((f) => f.name === filter.name)));

    useEffect(() => {
        setHasFiltersSelected(selectedFilters.filter(f => f.value !== undefined).length > 0);
    }, [selectedFilters]);

    return <div className={cn("flex items-center gap-2 flex-wrap", className)}>
        {children}
        {displayFilters.map((filter) => {
            const currentFilter = selectedFilters.find((f) => f.name === filter.name);

            return <FilterContext.Provider value={{
                settings: filter,
                selection: currentFilter,
                removeFilter: () => {
                    if (filter.featured) {
                        addFilter(filter.name, null, null);
                    } else {
                        removeFilter(filter.name);
                    }
                },
                addFilter: (value: any, body: any) => {
                    if (!deepEqual(body, currentFilter?.body)) {
                        addFilter(filter.name, value, body);
                    }
                }
            }} key={filter.name}>
                {filter.component}
            </FilterContext.Provider>
        })}

        {additionalFilters.length > 0 && (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size={'sm'} className={'border-dashed'}><Filter /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 dark" align="center">
                    {additionalFilters.map((filter) => (
                        <DropdownMenuItem key={filter.name} onClick={() => {
                            addFilter(filter.name, null, null);
                        }}>{filter.label}</DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        )}
        {hasFiltersSelected && <Button variant={'secondary'} size={'sm'} onClick={() => {
            onFiltersChange(displayFilters.filter((f) => f.featured).map((f) => ({
                ...f,
                body: null
            })))
        }}>
            <X className={'size-3'}/>
            <FormattedMessage defaultMessage="Reset" description="Button to reset all filters" />
        </Button>}
    </div>
}

export const FilterRemoveButton = ({onClick}: {onClick?: () => void}) => {
    const {remove, selection} = useFilter();

    if(selection?.value === undefined || selection.value === null) {
        return null;
    }

    return <Button
        size={'sm'}
        variant={'outline'}
        className={'group-hover:bg-accent group/remove pl-0 h-8 border-0 shadow-none rounded-4xl pr-2 focus-visible:ring-[3px]'}
        onClick={() => {
            onClick?.();
            remove();
        }}
    >
            <span className={'p-0.5 ml-1.5 rounded-full group-hover/remove:bg-gray-300'}>
                <X className={'size-3'}/>
            </span>
    </Button>;
}