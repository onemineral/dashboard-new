import * as React from "react";
import {useContext} from "react";
import {AppContext} from "@/contexts/app-context";
import Field from "@/models/field";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Switch} from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {DateRangePicker} from "./daterange-picker";
import {ColorPicker} from "./color-picker";
import {PercentageInput} from "./percentage-input";
import {PhoneInput} from "./phone";
import {TimePicker} from "./time";
import {GeoLocationInput} from "./geolocation-input";
import {MultiLanguageInput} from "./multi-language-input";
import {MultiLanguageTextarea} from "./multi-language-textarea";
import {AccountSelect} from "./account-select";
import {PropertySelect} from "./property-select";
import {BookingSelect} from "./booking-select";
import {InputWrapper} from "./input-wrapper";
import {TextareaTiptap} from "@/components/application/inputs/textarea-tiptap.tsx";
import {cn} from "@/lib/utils.ts";
import {Currency} from "@onemineral/pms-js-sdk";

/**
 * Props for the ResourceInput component
 */
export interface ResourceInputProps {
    /** Resource name (e.g., "property", "booking", "user") */
    resource: string;
    /** Field name within the resource */
    field: string;
    /** Optional action name for action-specific fields */
    action?: string;
    /** Current value of the input */
    value?: any;
    /** Change handler */
    onChange?: (value: any) => void;
    /** Blur handler (for form validation) */
    onBlur?: () => void;
    /** Whether the input is disabled */
    disabled?: boolean;
    /** Additional className for the wrapper */
    className?: string;
    /** Additional className for the input */
    inputClassName?: string;
    /** Placeholder text (overrides field default) */
    placeholder?: string;
    /** Error message to display */
    error?: string | boolean;
    /** Hide the label (useful when used in custom layouts) */
    hideLabel?: boolean;
    /** Custom label (overrides field label) */
    label?: string;
    /** Custom description (overrides field description) */
    description?: string;
    /** Info tooltip content */
    infoTooltip?: React.ReactNode;
    /** Custom options for each field **/
    options?: CustomResourceInputOptions,
    /** Test ID for testing */
    "data-testid"?: string;
}

export interface CustomResourceInputOptions {
    resource_type?: string;
    currency?: string | Currency;
}

/**
 * Map field types to their corresponding input components
 */
const INPUT_TYPE_MAP: Record<
    string,
    (props: any, field: Field) => React.ReactNode
> = {
    // Text inputs
    text: (props, field) => {
        if (field.spec.options?.multiline) {
            if (field.spec.options?.html) {
                return <TextareaTiptap {...props} />;
            } else {
                return <Textarea {...props} />;
            }
        } else {
            return <Input type={'text'} {...props} />;
        }
    },
    email: (props) => (
        <Input
            type="email"
            {...props}
        />
    ),
    url: (props) => (
        <Input
            type="url"
            {...props}
        />
    ),
    secret: (props) => (
        <Input
            type="password"
            {...props}
        />
    ),

    // Numeric inputs
    integer: (props) => (
        <Input
            type="number"
            step="1"
            {...props}
        />
    ),
    decimal: (props) => (
        <Input
            type="number"
            step="0.01"
            {...props}
        />
    ),
    price: (props) => (
        <Input
            type="number"
            step="0.01"
            {...props}
        />
    ),

    // Specialized inputs
    percent: (props) => <PercentageInput {...props} />,
    phone: (props) => <PhoneInput {...props} />,
    color: (props) => <ColorPicker {...props} />,
    time: (props) => <TimePicker {...props} />,
    geo: (props) => <GeoLocationInput {...props} />,

    // Date inputs
    date: (props) => (
        <Input
            type="date"
            {...props}
        />
    ),
    daterange: (props) => <DateRangePicker {...props} />,

    // Boolean inputs
    boolean: (props) => (
        <Switch
            checked={props.value}
            onCheckedChange={props.onChange}
            disabled={props.disabled}
            data-testid={props["data-testid"]}
        />
    ),

    // Picklist/Select
    picklist: (props, field) => (
        // @todo: implement logic to display radio list if only a few options exist, or specify through custom options
        <Select
            value={props.value}
            onValueChange={props.onChange}
            disabled={props.disabled}
        >
            <SelectTrigger
                className={cn('w-full', props.className)}
                data-testid={props["data-testid"]}
            >
                <SelectValue placeholder={props.placeholder}/>
            </SelectTrigger>
            <SelectContent>
                {Object.keys(field.possibleValues)?.map((key: string) => (
                    <SelectItem key={key} value={key}>
                        {field.possibleValues[key]}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    ),

    // Translated/Multi-language inputs
    "translated-text": (props, field) => {
        if (field.spec.options?.multiline) {
          // @todo: add html version
            return <MultiLanguageTextarea {...props} />
        }
        return <MultiLanguageInput {...props} />
    },

    // Relation inputs
    "belongs-to": (props, field) => {
        // Determine which specialized select to use based on the related resource
        const relatesTo = (field as any).relatesTo;

        switch (relatesTo) {
            case "account":
                return <AccountSelect {...props} />;
            case "property":
                return <PropertySelect {...props} />;
            case "booking":
                return <BookingSelect {...props} />;
            default:
                // @todo: implement generic belongs-to relation select
                return (
                    <Input
                        type="text"
                        placeholder={`Select ${relatesTo}...`}
                        {...props}
                    />
                );
        }
    },
};

/**
 * ResourceInput Component
 *
 * A dynamic input field renderer that automatically selects and renders
 * the appropriate input component based on the field type defined in the schema.
 * Wraps the input with InputWrapper for consistent styling, labels, descriptions,
 * and error handling.
 *
 * This component integrates with the application's Schema to retrieve field
 * definitions and render type-appropriate inputs with proper validation,
 * placeholders, and formatting.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <ResourceInput
 *   resource="property"
 *   field="name"
 *   value={value}
 *   onChange={setValue}
 * />
 *
 * // With React Hook Form
 * <Controller
 *   name="email"
 *   control={control}
 *   render={({ field, fieldState }) => (
 *     <ResourceInput
 *       resource="user"
 *       field="email"
 *       value={field.value}
 *       onChange={field.onChange}
 *       onBlur={field.onBlur}
 *       error={fieldState.error?.message}
 *     />
 *   )}
 * />
 *
 * // With action-specific field
 * <ResourceInput
 *   resource="booking"
 *   field="status"
 *   action="update"
 *   value={status}
 *   onChange={setStatus}
 *   error={errors.status}
 * />
 *
 * // Hide label for custom layouts
 * <ResourceInput
 *   resource="property"
 *   field="name"
 *   hideLabel
 *   value={value}
 *   onChange={setValue}
 * />
 * ```
 */
export const ResourceInput = React.memo<ResourceInputProps>(
    ({
         resource,
         field: fieldName,
         action,
         value,
         onChange,
         onBlur,
         disabled = false,
         className,
         inputClassName,
         placeholder,
         error,
         hideLabel = false,
         label: customLabel,
         description: customDescription,
         infoTooltip,
         "data-testid": dataTestId,
        options = {},
     }) => {
        const {schema} = useContext(AppContext);

        // Find the field definition from the schema
        const field = React.useMemo(() => {
            if (!schema) return null;
            return schema.findField(resource, fieldName, action);
        }, [schema, resource, fieldName, action]);

        if (!field) {
            // field not found in schema. nothing we can do
            return null;
        }

        // Get the appropriate renderer for this field type
        const renderer = INPUT_TYPE_MAP[field.type];

        if (!renderer) {
            // there is no input mapping for this field type
            return null;
        }

        // Prepare props for the input component
        const inputProps = {
            ...options,
            value: value ?? (field.defaultValue ?? ''),
            onChange: (e: any) => {
              if(typeof e == 'object' && e.target) {
                onChange?.(e.target.value);
              } else {
                  onChange?.(e);
              }
            },
            onBlur,
            disabled,
            className: inputClassName,
            placeholder,
            "data-testid": dataTestId,
        };

        // Render the appropriate input component wrapped with InputWrapper
        return (
            <InputWrapper
                label={hideLabel ? undefined : (customLabel ?? field.label)}
                description={customDescription ?? field.description}
                required={field.isRequired}
                disabled={disabled}
                error={error}
                infoTooltip={infoTooltip}
                className={className}
                data-testid={dataTestId ? `${dataTestId}-wrapper` : undefined}
            >
                {renderer(inputProps, field)}
            </InputWrapper>
        );
    }
);

ResourceInput.displayName = "ResourceInput";

/**
 * Export the component as default
 */
export default ResourceInput;