import { useContext, useMemo } from 'react';
import { AppContext } from '@/contexts/app-context';
import { z } from 'zod';

/**
 * Hook to filter a Zod schema based on user permissions
 * 
 * This hook takes a Zod schema and filters out fields that the user doesn't have access to
 * based on the schema permissions. It's useful for forms where different users might have
 * access to different fields.
 * 
 * @param resource - The resource name (e.g., 'property', 'booking')
 * @param action - The action name (e.g., 'create', 'update', 'set-rates-availability')
 * @param schema - The full Zod schema with all possible fields
 * @returns A filtered Zod schema containing only fields the user has access to
 * 
 * @example
 * ```tsx
 * const fullSchema = z.object({
 *   daterange: z.object({
 *     start: z.union([z.string(), z.date()]),
 *     end: z.union([z.string(), z.date()]),
 *   }),
 *   rate: z.number().positive(),
 *   min_stay: z.number().int().positive(),
 * });
 * 
 * const zodSchema = useZodSchema('property', 'set-rates-availability', fullSchema);
 * 
 * const form = useForm({
 *   resolver: zodResolver(zodSchema),
 * });
 * ```
 */
export function useZodSchema<T extends z.ZodRawShape>(
  resource: string,
  action: string | undefined,
  schema: z.ZodObject<T>
): z.ZodObject<any> {
  const { schema: appSchema } = useContext(AppContext);

  return useMemo(() => {
    if (!appSchema) {
      // If no schema is available, return an empty object schema
      return z.object({});
    }

    const shape = schema.shape;
    const filteredShape: Record<string, z.ZodTypeAny> = {};

    // Iterate through all fields in the schema
    for (const [fieldName, fieldSchema] of Object.entries(shape)) {
      // Check if user has permission to access this field
      if (appSchema.can(resource, fieldName, action)) {
        filteredShape[fieldName] = fieldSchema;
      }
    }

    return z.object(filteredShape);
  }, [appSchema, resource, action, schema]);
}