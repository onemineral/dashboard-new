import React, {useContext, useMemo} from "react";
import {AppContext} from "@/contexts/app-context.tsx";
import {FilterSettings} from "@/components/application/filters/filters";
import Schema from "@/models/Schema.ts";
import Field from "@/models/field.tsx";
import PicklistFilter from "@/components/application/filters/types/picklist-filter";
import CheckboxListFilter from "@/components/application/filters/types/checkbox-list-filter";
import BooleanRadioFilter from "../types/boolean-radio-filter";

type FilterDefinition = {
    field: string,
    featured?: boolean,
    label?: React.ReactNode,
};

function toFilterSettings(schema: Schema, resource: string, filter: FilterDefinition|string): FilterSettings|null {
    if(typeof filter === 'string') {
        if(schema.can(resource, filter)) {
            const field = schema.findField(resource, filter) as Field;
            const component = resolveFieldComponent(field, filter);
            return {
                name: filter,
                label: field?.label,
                component,
            }
        } else {
            return null;
        }
    } else {
        const f = toFilterSettings(schema, resource, filter.field);

        return f ? {
            ...f,
            featured: filter.featured,
            label: filter?.label || f.label,
        } : null;
    }
}

function resolveFieldComponent(field: Field, fieldName: string) {
    switch(field.type) {
        case 'picklist':
            if(Object.keys(field.possibleValues).length > 5) {
                return <PicklistFilter options={field.possibleValues} field={fieldName} />;
            } else {
                return <CheckboxListFilter options={field.possibleValues} field={fieldName} />
            }
        case 'boolean':
            return <BooleanRadioFilter field={fieldName} />
        default:
            return null;
    }
}

export default function useFiltersDefinition(resource: string, availableFilters: (FilterDefinition|string|FilterSettings)[]): FilterSettings[] {
    const { schema } = useContext(AppContext);

    return useMemo(() => {
        return availableFilters
            .map((f): FilterSettings|null => {
                // check if f is a FilterSettings object

                if(typeof f !== 'string' && (f as FilterSettings).component) {
                    return f as FilterSettings;
                } else {
                    return toFilterSettings(schema, resource, f as FilterDefinition|string);
                }
            })
            .filter((f: FilterSettings|null) => f) as FilterSettings[];
    }, [availableFilters, resource, schema])
}