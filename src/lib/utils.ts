import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {format} from "date-fns";

export const YMD_FORMAT = "yyyy-MM-dd";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Merges 2 objects into a single object. Identical keys with non array values will be replaced, array values will be merged
 *
 * @param obj1 object|null|undefined
 * @param obj2 object|null|undefined
 */
export function mergeObjects(obj1: object|null|undefined, obj2: object|null|undefined) {
  if(!obj1) {
    return obj2;
  }

  if(!obj2) {
    return obj1;
  }

  const result: any = {...obj1 || {}};

  Object.keys(obj2 || {}).forEach((key:string) => {
    const value: any = (obj2 as any)[key];

    if(result[key] == undefined) {
      result[key] = value;
    } else if(Array.isArray(result[key]) && Array.isArray(value)) {
      // both values are arrays. we can append obj2 values to obj1 values
      result[key] = [
          ...result[key],
          ...value,
      ];
    } else if(typeof result[key] === "object" && typeof value === "object") {
      result[key] = mergeObjects(result[key], value);
    } else {
      // no way to merge properly. the second object will overwrite the first
      result[key] = value;
    }
  });

  return result;
}

/**
 * Get flag emoji for a language by converting its ISO locale country code to a flag emoji.
 * Uses Unicode Regional Indicator Symbols (same approach as phone component).
 *
 * @param isoLocale - ISO locale string (e.g., "en_US", "es_ES", "fr_FR")
 * @returns Flag emoji for the country code
 */
export function getFlagEmoji(isoLocale: string): string {
    if(!isoLocale){
        return '';
    }

    // Extract country code from ISO locale (e.g., "en_US" -> "US")
    let countryCode: string = isoLocale;
    if(isoLocale.length > 2) {
        countryCode = isoLocale.split("_")[1];
    }

    if (!countryCode || countryCode.length !== 2) {
        return "🌐"; // Fallback globe emoji
    }

    // Convert country code to flag emoji using Regional Indicator Symbols
    // Each letter is converted to its corresponding Regional Indicator Symbol
    // by adding 127397 to the character code (127462 - 65 = 127397, where 65 is 'A')
    const codePoints = countryCode
        .toUpperCase()
        .split("")
        .map((char) => 127397 + char.charCodeAt(0));

    return String.fromCodePoint(...codePoints);
}

export function formatDate(date: Date | string) {
    if(typeof date === 'string') {
        return date;
    }
    return format(date, 'yyyy-MM-dd');
}

/**
 * Maps server-side validation errors from a 422 response to React Hook Form field errors.
 * This allows API validation errors to be displayed in the same way as Zod client-side validation.
 *
 * Supports both flat and nested field paths (e.g., "rate" or "advanced.thursday.rate")
 *
 * @param form - React Hook Form instance with setError method
 * @param errors - Errors object from API response (e.g., error.responseBody.errors)
 *
 * @example
 * // In mutation onError handler:
 * onError: (error: any) => {
 *   if (error?.responseBody?.errors) {
 *     handleServerErrors(form, error.responseBody.errors);
 *     toast.error("Please check the form for errors");
 *   }
 * }
 *
 * // API error format (flat):
 * {
 *   "message": "The rate must be at least 50.",
 *   "errors": {
 *     "rate": ["The rate must be at least 50."],
 *     "min_stay": ["The minimum stay is required."]
 *   }
 * }
 *
 * // API error format (nested):
 * {
 *   "message": "The rate must be at least $65.00.",
 *   "errors": {
 *     "advanced.thursday.rate": ["The rate must be at least $65.00."]
 *   }
 * }
 */
export function handleServerErrors(
    form: { setError: (field: any, error: { type: string; message: string }) => void },
    errors: Record<string, string[]>
) {
    Object.keys(errors).forEach((field) => {
        if (errors[field] && errors[field].length > 0) {
            // React Hook Form supports dot notation for nested fields
            // e.g., "advanced.thursday.rate" will map to form.advanced.thursday.rate
            form.setError(field as any, {
                type: 'server',
                message: errors[field][0] // Take the first error message
            });
        }
    });
}