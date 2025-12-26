import { useIntl } from 'react-intl';
import { toast } from 'sonner';
import { handleServerErrors } from '@/lib/utils';

/**
 * Hook to create a standardized mutation error handler for forms.
 * 
 * This hook automatically handles:
 * - 422 validation errors by mapping them to form fields
 * - Showing appropriate toast messages
 * - Both validation and non-validation errors
 * 
 * @param form - React Hook Form instance with setError method
 * @param options - Optional custom error messages
 * 
 * @example
 * ```tsx
 * const form = useForm<FormData>({
 *   resolver: zodResolver(schema),
 * });
 * 
 * const handleMutationError = useMutationErrorHandler(form, {
 *   validationMessage: "Please fix the errors",
 *   genericMessage: "Failed to save"
 * });
 * 
 * const mutation = useMutation({
 *   mutationFn: async (data) => api.property.update(data),
 *   onError: handleMutationError
 * });
 * ```
 */
export function useMutationErrorHandler<TFieldValues extends Record<string, any>>(
    form: { setError: (field: keyof TFieldValues, error: { type: string; message: string }) => void },
    options?: {
        validationMessage?: string;
        genericMessage?: string;
    }
) {
    const intl = useIntl();

    return (error: any) => {
        console.log(error.responseBody);
        // Check if we have field-specific validation errors (422 response)
        if (error?.responseBody) {
            handleServerErrors(form, error.responseBody.errors || {});
            console.log(error.responseBody);
            // Show a generic toast for validation errors
            const message = options?.validationMessage || intl.formatMessage({
                defaultMessage: "Please check the form for errors",
                description: "Error message when form validation fails"
            });
            
            toast.error(error?.responseBody.message || message);
        } else {
            // For non-validation errors, show the error message
            const message = options?.genericMessage || intl.formatMessage({
                defaultMessage: "An error occurred",
                description: "Generic error message when operation fails"
            });
            
            toast.error(error?.message || message);
        }
    };
}