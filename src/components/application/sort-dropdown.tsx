import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { AppContext } from "@/contexts/app-context";
import Field from "@/models/field";
import { ArrowDown10, ArrowDownUp, ArrowDownZA, ArrowUp01, ArrowUpAZ } from "lucide-react";

type SortDirection = "asc" | "desc";

/**
 * SortDefinition
 *
 * Represents a sort option for a resource.
 *
 * @typedef {Object} SortDefinition
 * @property {string} field - The field name to sort by.
 * @property {"asc"|"desc"} direction - The sort direction: "asc" for ascending, "desc" for descending.
 */
export interface SortDefinition {
    field: string;
    direction: SortDirection;
}

/**
 * Props for the SortDropdown component.
 *
 * @typedef {Object} SortDropdownProps
 * @property {SortDefinition|null} [sort] - The currently selected sort definition (optional).
 * @property {string} resource - The resource name used to look up field metadata.
 * @property {string[]} availableFields - List of field names available for sorting.
 * @property {(selectedSort?: SortDefinition|null) => void} onChange - Callback invoked when the sort selection changes.
 */
export interface SortDropdownProps {
  /** The initially selected sort direction */
  sort?: SortDefinition|null;
  /** The resource to get the fields from */
  resource: string;
  /** List of available sort fields (label and value) */
  availableFields: string[];
  /** Callback when sort changes */
  onChange: (selectedSort?: SortDefinition|null) => void;
}

/**
 * SortDropdown Component
 *
 * Renders a dropdown menu for selecting a sort field and direction for a given resource.
 * Designed to be used in data tables or filter panels, allowing users to sort records by available fields.
 * Integrates with the application schema to provide field labels and type-aware icons.
 *
 * @component
 * @param {SortDropdownProps} props - The props for SortDropdown
 * @param {SortDefinition|null} [props.sort] - The currently selected sort definition (field and direction). Optional.
 * @param {string} props.resource - The resource name used to look up field metadata.
 * @param {string[]} props.availableFields - List of field names available for sorting.
 * @param {(selectedSort?: SortDefinition|null) => void} props.onChange - Callback invoked when the sort selection changes.
 *
 * @example
 * // Usage in a filter panel (see src/routes/pms/properties/index.tsx)
 * <SortDropdown
 *   resource="property"
 *   sort={sort}
 *   availableFields={['id', 'name', 'health_score_done_percent', 'bedrooms', 'max_occupancy']}
 *   onChange={setSort}
 * />
 *
 * @notes
 * - The component uses the application schema (via AppContext) to resolve field labels and types.
 * - Number fields display numeric sort icons; string fields display alphabetical sort icons.
 * - The `onChange` callback is called whenever the user selects a new sort option.
 * - The dropdown is fully controlled and can be integrated into filter toolbars or data table headers.
 * - If a field is not found in the schema, it is skipped in the dropdown.
 * - For best UX, provide user-friendly field names and ensure the schema is loaded.
 */
export const SortDropdown: React.FC<SortDropdownProps> = ({
  sort,
  availableFields,
  resource,
  onChange,
}) => {
  const [open, setOpen] = React.useState(false);
  const [selectedSort, setSelectedSort] = React.useState(sort);
  const {schema} = React.useContext(AppContext);

  // Call onChange when either field or direction changes
  React.useEffect(() => {
    onChange(selectedSort);
  }, [selectedSort]);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant={'ghost'} size={'sm'}><ArrowDownUp/></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-fit max-w-80 min-w-52 dark">
        <DropdownMenuRadioGroup
          value={JSON.stringify(selectedSort)}
          onValueChange={(value) => {
            if(value) {
                setSelectedSort(JSON.parse(value));
            } else {
                setSelectedSort(null);
            }
          }}
        >
          {availableFields.map((fieldName) => {
            const field:Field|null = schema.findField(resource, fieldName);

            if(!field) {
                return null;
            }

            const isNumber = ['integer', 'decimal', 'id', 'percent', 'price'].includes(field.type);

            return <>
            <DropdownMenuRadioItem key={`${field.name}-asc`} value={JSON.stringify({field: field.name, direction: 'asc'})} className={'flex justify-between'}>
                <span>{field.label} </span>
                <span>
                    {isNumber ? <ArrowUp01 className={'text-white size-5'} /> : <ArrowUpAZ className={'text-white size-5'} />}
                </span>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem key={`${field.name}-desc`} value={JSON.stringify({field: field.name, direction: 'desc'})} className={'flex justify-between'}>
                <span>{field.label} </span>
                <span>
                    {isNumber ? <ArrowDown10 className={'text-white size-5'} /> : <ArrowDownZA className={'text-white size-5'} />}
                </span>
            </DropdownMenuRadioItem>
            </>
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SortDropdown;