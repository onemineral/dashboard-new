# Forms
## Rules

1. All forms must use react-hook-form with the useForm() hook
2. All forms must be validated with zod
3. Make sure all zod validation error messages are translated using react-intl package
4. zod schema must be compatible with the api input object (you can see the api in @sdk/generated). all forms will make a request to this API
5. **All forms must use the `useZodSchema` hook** to filter form fields based on user permissions
6. **All forms must use the `useMutationErrorHandler` hook** for standardized error handling in mutations

## Form Construction Pattern

### 1. Define TypeScript Interface
Create a TypeScript interface for your form data that matches the API endpoint's expected input:

```tsx
interface CalendarUpdateFormData {
    daterange?: DateRangeValue;
    availability_status?: string;
    rate?: number;
    min_stay?: number;
}
```

### 2. Create Full Zod Schema
Define the **complete** Zod schema with all possible fields. Include translated validation messages using `useIntl()`:

```tsx
const intl = useIntl();

const fullSchema = z.object({
    daterange: z.object({
        start: z.union([z.string(), z.date()]).optional(),
        end: z.union([z.string(), z.date()]).optional(),
    }).refine((val) => val.start && val.end, {
        message: intl.formatMessage({
            defaultMessage: "Please select a date range",
            description: "Error message when date range is required but not selected"
        })
    }),
    availability_status: z.string({
        required_error: intl.formatMessage({
            defaultMessage: "Availability status is required",
            description: "Error message when availability status is required but not selected"
        })
    }).optional().nullable(),
    rate: z.number({
        invalid_type_error: intl.formatMessage({
            defaultMessage: "Rate must be a valid number",
            description: "Error message when rate is not a valid number"
        })
    }).positive(intl.formatMessage({
        defaultMessage: "Rate must be a positive number",
        description: "Error message when rate is not a positive number"
    })).optional().nullable(),
    min_stay: z.number({
        invalid_type_error: intl.formatMessage({
            defaultMessage: "Minimum stay must be a valid number",
            description: "Error message when minimum stay is not a valid number"
        })
    }).int().positive(intl.formatMessage({
        defaultMessage: "Minimum stay must be a positive number",
        description: "Error message when minimum stay is not a positive number"
    })).optional().nullable(),
});
```

**Important:** The schema keys MUST match:
- The TypeScript interface field names
- The API endpoint's expected input parameter names (check `@sdk/generated`)
- The field names in the schema for the resource and action

### 3. Apply Permission Filtering
Use `useZodSchema` to filter the schema based on user permissions:

```tsx
import { useZodSchema } from '@/hooks/use-zod-schema';

const validationSchema = useZodSchema('property', 'set-rates-availability', fullSchema);
```

**Parameters:**
- `resource`: The resource name (e.g., 'property', 'booking', 'account')
- `action`: The action name (e.g., 'create', 'update', 'set-rates-availability')
- `fullSchema`: The complete Zod schema object

This hook will:
- Check user permissions for each field in the schema
- Return a filtered schema containing only fields the user can access
- Use `appSchema.can(resource, fieldName, action)` for permission checks

### 4. Initialize React Hook Form
Use the filtered schema with zodResolver:

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const form = useForm<CalendarUpdateFormData>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
        daterange: daterange || undefined,
        availability_status: undefined,
        rate: undefined,
        min_stay: undefined,
    }
});
```

### 5. Render Form Fields with Controller
Use `Controller` for each field and `ResourceInput` for schema-aware rendering:

```tsx
import { Controller } from 'react-hook-form';
import ResourceInput from '@/components/application/inputs/resource-input';

<Controller
    name="rate"
    control={form.control}
    render={({field, fieldState}) => (
        <ResourceInput
            resource={'property'}
            field={'rate'}
            action={'set-rates-availability'}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
            options={{currency: property.currency}}
        />
    )}
/>
```

**Why ResourceInput?**
- Automatically renders the correct input component based on schema field type
- Handles labels, descriptions, and validation messages
- Respects user permissions (fields not in filtered schema won't render)
- Provides consistent UI across all forms

### 6. Create Mutation with Error Handler
Create the mutation using the `useMutationErrorHandler` hook for consistent error handling:

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useMutationErrorHandler } from '@/hooks/use-mutation-error-handler';

const queryClient = useQueryClient();

// Create the error handler
const handleMutationError = useMutationErrorHandler(form, {
    validationMessage: intl.formatMessage({
        defaultMessage: "Please check the form for errors",
        description: "Error message when form validation fails"
    }),
    genericMessage: intl.formatMessage({
        defaultMessage: "Failed to update calendar",
        description: "Error message when calendar update fails"
    })
});

const mutation = useMutation({
    mutationFn: async (data: CalendarUpdateFormData) => {
        return (await api.property.setRatesAvailability({
            property: property.id,
            ...data,
        })).response;
    },
    onSuccess: () => {
        toast.success(intl.formatMessage({
            defaultMessage: "Calendar updated successfully",
            description: "Success message after updating calendar rates and availability"
        }));
        queryClient.invalidateQueries({queryKey: ['property']});
        onClose();
    },
    onError: handleMutationError
});
```

**The `useMutationErrorHandler` hook provides:**
- Automatic handling of 422 validation errors from the server
- Maps server validation errors to form fields using `setError`
- Shows appropriate toast messages for both validation and generic errors
- Consistent error handling across all forms

**Parameters:**
- `form`: React Hook Form instance (must have `setError` method)
- `options.validationMessage`: Custom message for validation errors (optional)
- `options.genericMessage`: Custom message for generic errors (optional)

**Important:**
- The form data interface keys MUST match the API endpoint's expected parameters
- Verify the API signature in `@sdk/generated` before defining the schema
- The API will ignore undefined/null values, so no need to filter them out manually
- The error handler automatically maps server validation errors to form fields

### 7. Handle Form Submission
```tsx
const onSubmit = form.handleSubmit((data) => {
    mutation.mutate(data);
});

<form onSubmit={onSubmit}>
    {/* form fields */}
</form>

<Button
    type="submit"
    onClick={onSubmit}
    disabled={mutation.isPending}
>
    {mutation.isPending ? (
        <FormattedMessage
            defaultMessage="Saving..."
            description="Button text while saving the form"
        />
    ) : (
        <FormattedMessage
            defaultMessage="Save Changes"
            description="Button text to save the form"
        />
    )}
</Button>
```

## Complete Form Example

```tsx
import { FormattedMessage, useIntl } from "react-intl";
import { Controller, useForm } from "react-hook-form";
import ResourceInput from "@/components/application/inputs/resource-input";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";
import { z } from "zod";
import { useZodSchema } from "@/hooks/use-zod-schema";
import { useMutationErrorHandler } from "@/hooks/use-mutation-error-handler";
import { zodResolver } from "@hookform/resolvers/zod";

interface MyFormData {
    field1: string;
    field2?: number;
}

export default function MyForm({ resource, onClose }) {
    const intl = useIntl();
    const queryClient = useQueryClient();

    // 1. Define full schema
    const fullSchema = z.object({
        field1: z.string({
            required_error: intl.formatMessage({
                defaultMessage: "Field 1 is required",
                description: "Error when field1 is missing"
            })
        }),
        field2: z.number().optional().nullable(),
    });

    // 2. Filter by permissions
    const validationSchema = useZodSchema('resource', 'action', fullSchema);

    // 3. Initialize form
    const form = useForm<MyFormData>({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            field1: '',
            field2: undefined,
        }
    });

    // 4. Create error handler
    const handleMutationError = useMutationErrorHandler(form);

    // 5. Create mutation
    const mutation = useMutation({
        mutationFn: async (data: MyFormData) => {
            return (await api.resource.action({
                ...data,
            })).response;
        },
        onSuccess: () => {
            toast.success(intl.formatMessage({
                defaultMessage: "Saved successfully",
                description: "Success message"
            }));
            queryClient.invalidateQueries({queryKey: ['resource']});
            onClose();
        },
        onError: handleMutationError
    });

    // 6. Submit handler
    const onSubmit = form.handleSubmit((data) => {
        mutation.mutate(data);
    });

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <Controller
                name="field1"
                control={form.control}
                render={({field, fieldState}) => (
                    <ResourceInput
                        resource={'resource'}
                        field={'field1'}
                        action={'action'}
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        error={fieldState.error?.message}
                    />
                )}
            />
            
            <Controller
                name="field2"
                control={form.control}
                render={({field, fieldState}) => (
                    <ResourceInput
                        resource={'resource'}
                        field={'field2'}
                        action={'action'}
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        error={fieldState.error?.message}
                    />
                )}
            />

            <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? (
                    <FormattedMessage defaultMessage="Saving..." description="Saving button text" />
                ) : (
                    <FormattedMessage defaultMessage="Save" description="Save button text" />
                )}
            </Button>
        </form>
    );
}
```

## Key Validation Checklist

Before finalizing any form, verify:

1. ✅ **Schema Keys Match API**: All Zod schema keys exist in the API endpoint's input parameters (check `@sdk/generated`)
2. ✅ **TypeScript Interface Matches**: Form data interface matches both schema and API
3. ✅ **Permission Filtering Applied**: `useZodSchema` is used to filter based on user access
4. ✅ **Validation Messages Translated**: All Zod error messages use `intl.formatMessage()`
5. ✅ **ResourceInput Used**: Fields are rendered with `ResourceInput` for consistency
6. ✅ **Query Invalidation**: Successful mutations invalidate relevant query keys
7. ✅ **Error Handling**: `useMutationErrorHandler` is used in mutation's `onError` callback
8. ✅ **Input**: Whenever no special inputs are required just use the ResourceInput component

## Common Pitfalls to Avoid

❌ **DON'T** skip `useZodSchema` - forms will show fields users can't access
❌ **DON'T** hardcode validation messages - always use `intl.formatMessage()`
❌ **DON'T** manually filter undefined/null values in mutation - just spread the data object
❌ **DON'T** forget to check API signature in `@sdk/generated` for correct field names
❌ **DON'T** forget to invalidate queries after successful mutations if necessary. example: if we make a request to update a property "api.property.update" we should invalidate 2 query keys: ["property.query"] and ["property.fetch", PROPERTY_ID]
❌ **DON'T** manually handle 422 validation errors - use `useMutationErrorHandler` instead
❌ **DON'T** write custom error handling logic in each form - use the standardized error handler